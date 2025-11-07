'use client';

import { use, useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Form } from '@core/ui/form';
import { Text, Input, ActionIcon, Button, Password, Alert } from 'rizzui';
import { FormBlockWrapper } from '@/app/shared/invoice/form-utils';
import { toast } from 'react-hot-toast';
import WidgetCard from '@core/components/cards/widget-card';
import { signOut, useSession } from 'next-auth/react';
import { BankStatusResponse, BankData } from '@/types';
import Swal from 'sweetalert2';
import {
  WithdrawalBonusInput,
  withdrawalBonusSchema,
} from '@/validators/withdrawal-bonus-schema';
import Link from 'next/link';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { getBankNameByCode } from '@/utils/helper';
import { handleSessionExpired } from '@/utils/sessionHandler';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';

// Root transaction structure
export interface Transaction {
  source: string;
  kode_invoice: string;
  client_id: string;
  callback_data: CallbackData;
}

// Callback data details
export interface CallbackData {
  transaction_id: string;
  reference_id: string;
  customer: Customer;
  bill_detail: BillDetail;
  bill_payment: BillPayment;
  status: Status;
  created_at: string; // ISO-like datetime string
}

// Customer info
export interface Customer {
  name: string;
  phone: string;
}

// Bill details (amount breakdown)
export interface BillDetail {
  sub_total: string;
  fee: string;
  total: string;
}

// Payment info
export interface BillPayment {
  amount: string;
  via: string; // e.g. "va"
  channel: string; // e.g. "bni"
}

// Transaction status
export interface Status {
  code: string;
  message: string;
}

export interface WithdrawalSummarySingleResponse {
  code: number;
  success: boolean;
  message: string;
  data: WithdrawalSummaryData;
}

export interface WithdrawalSummaryData {
  username: string;
  name: string;
  plan: string;
  bank_account: BankAccount;
  commission_report: CommissionSection;
  withdrawal: WithdrawalSection;
  balance: AmountCurrency;
  commission_log: CommissionSection;
  difference: CommissionSection;
}

export interface BankAccount {
  bank_name: string;
  account_number: string;
  account_name: string;
}

export interface CommissionSection {
  salary: AmountCurrencyWithCount;
  total: AmountCurrency;
}

export interface WithdrawalSection {
  amount: number;
  count: number;
  currency: string;
}

export interface AmountCurrency {
  amount: number;
  currency: string;
}

export interface AmountCurrencyWithCount extends AmountCurrency {
  count?: number;
}

export default function WithdrawalGajiForm(slug: any) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [proses, setProses] = useState(false);

  const [reset, setReset] = useState({});
  const [dataGaji, setDataGaji] = useState<WithdrawalSummaryData | null>(null);
  const [dataBank, setDataBank] = useState<BankData[]>([]);

  const doWD = async (payload: any) => {
    if (!session?.accessToken) {
      handleSessionExpired();
      return;
    }

    fetchWithAuth<Transaction>(
      `/_transactions`,
      {
        method: 'POST',
        body: JSON.stringify({
          username: payload?.username,
          amount: payload?.amount,
          type: 'withdrawal',
          type_plan: 'plan_a',
        }),
      },
      session.accessToken
    )
      .then((data) => {
        toast.success(<Text>Withdrawal Bonus Berhasil!</Text>);
        setTimeout(() => {
          router.push(routes.withdrawalBonus.index);
        }, 300);
      })
      .catch((error) => {
        console.error(error);
        toast.error(<Text>Withdrawal Bonus Gagal!</Text>);
      })
      .finally(() => setLoading(false));
  };

  const onSubmit: SubmitHandler<WithdrawalBonusInput> = (data) => {
    setProses(true);

    Swal.fire({
      title: 'Konfirmasi Pencairan',
      html: 'Harap pastikan data yang Anda masukkan benar. Jika sudah silakan <strong>LANJUTKAN</strong>',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Lanjutkan',
      cancelButtonText: 'Batal',
      customClass: {
        confirmButton:
          'bg-[#AA8453] hover:bg-[#a16207] text-white font-semibold px-4 py-2 rounded me-3', // 👈 your custom class here
        cancelButton:
          'bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded',
      },
      buttonsStyling: false, // 👈 important! disable default styling
    })
      .then((result: any) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          if (data.amount < 20000) {
            toast.error(<Text>Min Rp 20.000,00 dalam sekali pencairan</Text>);
          } else {
            doWD(data);
          }
        } else {
          toast.success(<Text>Pencairan dibatalkan!</Text>);
        }
      })
      .finally(() => setProses(false));
  };

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    Promise.all([
      fetchWithAuth<WithdrawalSummarySingleResponse>(
        `/_transactions/withdrawal-data?type=plan_a&username=${session?.user?.id || ''}&category=salary`,
        { method: 'GET' },
        session.accessToken
      ),
      fetchWithAuth<BankStatusResponse>(
        `/_services/list-bank`,
        { method: 'GET' },
        session.accessToken
      ),
    ])
      .then(([withdrawalData, bankData]) => {
        setDataGaji(withdrawalData?.data || null);
        setDataBank(bankData?.data || []);
      })
      .catch((error) => {
        console.error(error);
        setDataGaji(null);
        setDataBank([]);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  if (isLoading)
    return <p className="py-20 text-center">Sedang memuat data...</p>;

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <WidgetCard
          title="Form Withdrawal Gaji"
          titleClassName="text-[#c69731] font-bold text-2xl sm:text-2xl font-inter mb-5"
        >
          <div>
            <Form<WithdrawalBonusInput>
              validationSchema={withdrawalBonusSchema}
              resetValues={reset}
              onSubmit={onSubmit}
              useFormProps={{
                defaultValues: {
                  username: session?.user?.id || '',
                  amount: 0,
                },
              }}
              className="flex flex-grow flex-col @container [&_label]:font-medium"
            >
              {({ register, control, watch, formState: { errors } }) => (
                <>
                  <div className="flex-grow pb-10">
                    <Alert variant="flat" color="success" className="mb-5">
                      <Text className="font-semibold">Informasi</Text>
                      <ol className="list-disc ps-5">
                        <li>
                          <Text className="break-normal">
                            Anda memiliki total{' '}
                            <strong>{dataGaji?.balance?.currency}</strong> poin
                          </Text>
                        </li>
                        <li>
                          <Text className="break-normal">
                            Withdrawal Gaji dapat dlakukan jika poin Anda sudah
                            mencapai <strong>25 poin</strong>, dan akan
                            dicairkan menjadi <strong>Rp 1.500.000</strong>
                          </Text>
                        </li>
                      </ol>
                    </Alert>

                    <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12">
                      <FormBlockWrapper title={'Informasi Pencairan:'}>
                        <Input
                          label="Username Anda"
                          {...register('username')}
                          readOnly
                          inputClassName="bg-gray-200 text-gray-600"
                        />
                        <Input
                          label="Jumlah Gaji"
                          value={dataGaji?.balance?.currency}
                          readOnly
                          disabled
                        />
                        <Input
                          label="Bank"
                          value={
                            getBankNameByCode(
                              dataBank,
                              dataGaji?.bank_account?.bank_name ?? ''
                            ) ?? ''
                          }
                          readOnly
                          disabled
                        />
                        <Input
                          label="No. Rekening"
                          value={dataGaji?.bank_account?.account_number}
                          readOnly
                          disabled
                        />
                        <Input
                          label="Atas Nama"
                          value={dataGaji?.bank_account?.account_name}
                          readOnly
                          disabled
                        />
                      </FormBlockWrapper>
                      <FormBlockWrapper
                        title={'Nominal Pencairan:'}
                        className="pt-7 @2xl:pt-9 @3xl:pt-11"
                      >
                        <Input
                          label="Nominal Pencairan"
                          {...register('amount')}
                          prefix={'Rp'}
                          type="number"
                          error={errors?.amount?.message as string}
                        />
                      </FormBlockWrapper>
                    </div>
                  </div>
                  <div className="-mb-4 flex items-center justify-end gap-4 border-t py-4 dark:bg-gray-50">
                    <Link href="/withdrawal-gaji">
                      <Button variant="outline" className="w-full @xl:w-auto">
                        Batal
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      isLoading={proses}
                      disabled={proses}
                      className="w-full @xl:w-auto"
                    >
                      Cairkan Sekarang
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
