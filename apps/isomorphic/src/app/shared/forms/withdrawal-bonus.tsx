'use client';

import { use, useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Form } from '@core/ui/form';
import { Text, Input, ActionIcon, Button, Password, Alert } from 'rizzui';
import { FormBlockWrapper } from '@/app/shared/invoice/form-utils';
import { toast } from 'react-hot-toast';
import WidgetCard from '@core/components/cards/widget-card';
import { signOut, useSession } from 'next-auth/react';
import {
  TransactionWDResponse,
  TransactionWDData,
  BankStatusResponse,
  BankData,
} from '@/types';
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

export default function WithdrawalBonusForm(slug: any) {
  const { data: session } = useSession();
  const usernamenya = slug?.slug ?? null;
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [proses, setProses] = useState(false);

  const [reset, setReset] = useState({});
  const [dataUser, setDataUser] = useState<TransactionWDData | null>(null);
  const [dataBank, setDataBank] = useState<BankData[]>([]);

  const doWD = async (payload: any) => {
    if (!session?.accessToken) {
      handleSessionExpired();
      return;
    }

    setProses(true);

    fetchWithAuth<Transaction>(
      `/_transactions`,
      {
        method: 'POST',
        body: JSON.stringify({
          username: payload?.username,
          amount: payload?.amount,
          category: 'bonus',
          type: 'withdrawal',
          type_plan: 'plan_a',
        }),
      },
      session.accessToken
    )
      .then((data) => {
        toast.success(<Text>Withdrawal Bonus Berhasil!</Text>);
        setTimeout(() => {
          router.push(routes.withdrawalBonus.history);
        }, 300);
      })
      .catch((error) => {
        console.error(error);
        toast.error(<Text>Withdrawal Bonus Gagal!</Text>);
        setLoading(false);
      });
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
    }).then((result: any) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if (data.amount < 50000) {
          toast.error(<Text>Min Rp 50.000,00 dalam sekali pencairan</Text>);
        } else {
          doWD(data);
        }
      } else {
        toast.success(<Text>Pencairan dibatalkan!</Text>);
        setProses(false);
      }
    });
  };

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    Promise.all([
      fetchWithAuth<TransactionWDResponse>(
        `/_transactions/withdrawal-data?type=plan_a&username=${usernamenya}&category=bonus`,
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
        setDataUser(withdrawalData?.data || null);
        setDataBank(bankData?.data || []);
      })
      .catch((error) => {
        console.error(error);
        setDataUser(null);
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
          title="Form Withdrawal Bonus"
          titleClassName="text-[#c69731] font-bold text-2xl sm:text-2xl font-inter mb-5"
        >
          <div>
            <Form<WithdrawalBonusInput>
              validationSchema={withdrawalBonusSchema}
              resetValues={reset}
              onSubmit={onSubmit}
              useFormProps={{
                defaultValues: {
                  username: usernamenya,
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
                            <strong>{dataUser?.balance?.currency}</strong> bonus
                          </Text>
                        </li>
                        <li>
                          <Text className="break-normal">
                            Minimal <strong>Rp 50.000,00</strong> dalam sekali
                            pencairan
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
                          label="Jumlah Bonus"
                          value={dataUser?.balance?.currency}
                          readOnly
                          disabled
                        />
                        <Input
                          label="Bank"
                          value={
                            getBankNameByCode(
                              dataBank,
                              dataUser?.bank_account?.bank_name ?? ''
                            ) ?? ''
                          }
                          readOnly
                          disabled
                        />
                        <Input
                          label="No. Rekening"
                          value={dataUser?.bank_account?.account_number}
                          readOnly
                          disabled
                        />
                        <Input
                          label="Atas Nama"
                          value={dataUser?.bank_account?.account_name}
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
                    <Link href="/withdrawal-bonus">
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
