'use client';

import { use, useEffect, useState } from 'react';
import { SubmitHandler, Controller } from 'react-hook-form';
import { Form } from '@core/ui/form';
import { Text, Input, ActionIcon, Button, Password } from 'rizzui';
import { FormBlockWrapper } from '@/app/shared/invoice/form-utils';
import { toast } from 'react-hot-toast';
import WidgetCard from '@core/components/cards/widget-card';
import { PiMinusBold, PiNotificationBold, PiPlusBold } from 'react-icons/pi';
import { useSession } from 'next-auth/react';
import {
  UserData,
  UserDataResponse,
  PinResponse,
  TransferPinResponse,
} from '@/types';
import Swal from 'sweetalert2';
import {
  WithdrawalBonusInput,
  withdrawalBonusSchema,
} from '@/validators/withdrawal-bonus-schema';
import Link from 'next/link';

export default function WithdrawalBonusForm(slug: any) {
  const { data: session } = useSession();
  const [reset, setReset] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [tujuan, setTujuan] = useState<UserData | null>(null);
  const [pin, setPin] = useState<number>(0);

  const getDataPin = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/_pins/dealer/${id}?fetch=random&type=plan_a`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-app-token': session?.accessToken ?? '',
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP error! ${res.status}`);

      const data = (await res.json()) as PinResponse;
      setPin(data?.data?.count);
      setLoading(false);
    } catch (error) {
      console.error('Fetch data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDataTo = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/_users/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-app-token': session?.accessToken ?? '',
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP error! ${res.status}`);

      toast.success(<Text as="b">Data {id} Ditemukan</Text>);
      const data = (await res.json()) as UserDataResponse;
      setTujuan(data?.data?.attribute ?? null);
      setLoading(false);
    } catch (error) {
      toast.error(<Text as="b">Data {id} Tidak Ditemukan</Text>);
      console.error('Fetch data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const doWD = async (payload: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/_pins/transfer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-app-token': session?.accessToken ?? '',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(`HTTP error! ${res.status}`);

      toast.success(<Text as="b">Transfer Berhasil!</Text>);
      getDataPin(session?.user?.id as string);
      rollbackTransfer();
      setLoading(false);
    } catch (error) {
      toast.error(<Text as="b">Transfer Gagal!</Text>);
      console.error('Fetch data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<WithdrawalBonusInput> = (data) => {
    setLoading(true);
    console.log(data);
    if (!tujuan) {
      getDataTo(data.username);
    } else {
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
            toast.error(<Text as="b">Min 50.000 dalam sekali pencairan</Text>);
          } else {
            return toast.success(<Text as="b">Pencairan Berhasil!</Text>);
            doWD({
              from: session?.user?.id,
              amount: data.amount,
              type_pin: 'plan_a',
              note: '',
            });
          }
          setLoading(false);
        } else {
          toast.success(<Text as="b">Pencairan dibatalkan!</Text>);
          setLoading(false);
        }
      });
    }
    // setTimeout(() => {
    //   setLoading(false);
    // }, 600);
  };

  const rollbackTransfer = () => {
    setReset({
      to: null,
      amount: pin,
      token: null,
      role: null,
      nama: null,
    });
    setTujuan(null);
  };

  useEffect(() => {
    if (session?.user?.id) {
      getDataPin(session.user.id);
    }
  }, [session?.accessToken]);

  if (isLoading)
    return <p className="my-5 text-center">Sedang memuat data...</p>;

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <WidgetCard
          title="Form Withdrawal Bonus"
          titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
        >
          <div>
            <Form<WithdrawalBonusInput>
              key={pin}
              validationSchema={withdrawalBonusSchema}
              resetValues={reset}
              onSubmit={onSubmit}
              useFormProps={{
                defaultValues: {
                  username: session?.user?.id,
                  jumlah: 'Rp 3.405.000',
                  bank: session?.user?.bankName as string,
                  norek: session?.user?.bankAccount as string,
                  an: session?.user?.bankOwner as string,
                  amount: 0,
                },
              }}
              className="flex flex-grow flex-col @container [&_label]:font-medium"
            >
              {({ register, control, watch, formState: { errors } }) => (
                <>
                  <div className="flex-grow pb-10">
                    <div className="mb-7 flex items-center space-x-2 rounded-lg bg-green-500 px-4 py-3 text-white shadow-lg">
                      <PiNotificationBold />
                      <ol className="list-disc ps-5">
                        <li>
                          Anda memiliki <strong>Rp 3.405.000</strong> Jumlah
                          Bonus
                        </li>
                        <li>
                          Maksimal <strong>2000</strong> PIN dalam sekali
                          transfer
                        </li>
                      </ol>
                    </div>

                    <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12">
                      <FormBlockWrapper title={'Informasi Pencairan:'}>
                        <Input
                          label="Username Anda"
                          {...register('username')}
                          readOnly
                          disabled
                          error={errors?.username?.message}
                        />
                        <Input
                          label="Jumlah Bonus"
                          {...register('jumlah')}
                          readOnly
                          disabled
                          error={errors?.jumlah?.message}
                        />
                        <Input
                          label="Bank"
                          {...register('bank')}
                          readOnly
                          disabled
                          error={errors?.bank?.message}
                        />
                        <Input
                          label="No. Rekening"
                          {...register('norek')}
                          readOnly
                          disabled
                          error={errors?.norek?.message}
                        />
                        <Input
                          label="Atas Nama"
                          {...register('an')}
                          readOnly
                          disabled
                        />
                      </FormBlockWrapper>
                      <FormBlockWrapper
                        title={'Nominal Pencairan:'}
                        className="hidden pt-7 @2xl:pt-9 @3xl:pt-11"
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
                  <div className="-mb-8 flex items-center justify-end gap-4 border-t py-4 dark:bg-gray-50">
                    <Link href="/withdrawal-bonus">
                      <Button variant="outline" className="w-full @xl:w-auto">
                        Batal
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      disabled={isLoading}
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
