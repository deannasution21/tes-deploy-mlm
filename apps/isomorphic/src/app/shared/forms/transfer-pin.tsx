'use client';

import { use, useEffect, useState } from 'react';
import { SubmitHandler, Controller } from 'react-hook-form';
import { Form } from '@core/ui/form';
import { Text, Input, ActionIcon, Button, Password } from 'rizzui';
import { FormBlockWrapper } from '@/app/shared/invoice/form-utils';
import { toast } from 'react-hot-toast';
import WidgetCard from '@core/components/cards/widget-card';
import { PiMinusBold, PiNotificationBold, PiPlusBold } from 'react-icons/pi';
import {
  TransferPinInput,
  transferPinSchema,
} from '@/validators/transfer-pin-schema';
import { useSession } from 'next-auth/react';
import {
  UserData,
  UserDataResponse,
  PinResponse,
  TransferPinResponse,
} from '@/types';
import Swal from 'sweetalert2';
import HistoryTransferPinTable from '../tables/history-transfer-pin';

function QuantityInput({
  name,
  error,
  onChange,
  defaultValue,
  max,
}: {
  name?: string;
  error?: string;
  onChange?: (value: number) => void;
  defaultValue?: number;
  max: number; // user's available PINs
}) {
  const [value, setValue] = useState(defaultValue ?? 1);

  // cap the max amount to 2000
  const finalMax = Math.min(max, 2000);

  function handleIncrement() {
    let newValue = value + 1;
    if (newValue > finalMax) newValue = finalMax;
    setValue(newValue);
    onChange?.(newValue);
  }

  function handleDecrement() {
    let newValue = value > 1 ? value - 1 : 1;
    setValue(newValue);
    onChange?.(newValue);
  }

  function handleOnChange(inputValue: number) {
    // sanitize manual typing
    let newValue = Number(inputValue);
    if (isNaN(newValue)) newValue = 1;
    if (newValue < 1) newValue = 1;
    if (newValue > finalMax) newValue = finalMax;
    setValue(newValue);
    onChange?.(newValue);
  }

  useEffect(() => {
    const initial = defaultValue ?? 1;
    const bounded = Math.min(initial, finalMax);
    setValue(bounded);
    onChange?.(bounded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalMax]);

  return (
    <Input
      label="Jumlah PIN yang akan ditransfer"
      type="number"
      min={1}
      max={finalMax}
      name={name}
      value={value}
      placeholder="1"
      disabled={finalMax === 0}
      onChange={(e) => handleOnChange(Number(e.target.value))}
      suffix={
        <>
          <ActionIcon
            title="Decrement"
            size="sm"
            variant="outline"
            className="scale-90 shadow-sm"
            disabled={finalMax === 0 || value <= 1}
            onClick={handleDecrement}
          >
            <PiMinusBold className="h-3.5 w-3.5" strokeWidth={2} />
          </ActionIcon>
          <ActionIcon
            title="Increment"
            size="sm"
            variant="outline"
            className="scale-90 shadow-sm"
            disabled={finalMax === 0 || value >= finalMax}
            onClick={handleIncrement}
          >
            <PiPlusBold className="h-3.5 w-3.5" strokeWidth={2} />
          </ActionIcon>
        </>
      }
      suffixClassName="flex gap-1 items-center -me-2"
      error={error}
    />
  );
}

export default function TransferPinPage() {
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

  const doTransfer = async (payload: any) => {
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

  const onSubmit: SubmitHandler<TransferPinInput> = (data) => {
    setLoading(true);
    if (!tujuan) {
      getDataTo(data.to);
    } else {
      Swal.fire({
        title: 'Konfirmasi Transfer',
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
          if (data.amount > 2000) {
            toast.error(<Text as="b">Max 2000 PIN dalam sekali transfer</Text>);
          } else {
            doTransfer({
              from: session?.user?.id,
              to: data.to,
              amount: data.amount,
              type_pin: 'plan_a',
              note: '',
              token: data.token,
            });
          }
        } else {
          toast.success(<Text as="b">Transfer dibatalkan!</Text>);
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

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <WidgetCard
          title="Form Transfer PIN"
          titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
        >
          <div>
            <Form<TransferPinInput>
              key={pin}
              validationSchema={transferPinSchema}
              resetValues={reset}
              onSubmit={onSubmit}
              useFormProps={{
                defaultValues: {
                  amount: pin > 0 ? 1 : 0,
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
                          Anda memiliki <strong>{pin}</strong> PIN
                        </li>
                        <li>
                          Maksimal <strong>2000</strong> PIN dalam sekali
                          transfer
                        </li>
                      </ol>
                    </div>

                    <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12">
                      <FormBlockWrapper title={'Data Pengirim:'}>
                        <Input
                          label="Username Member Tujuan"
                          placeholder="Ketikkan username"
                          {...register('to')}
                          error={errors.to?.message}
                        />
                        <Controller
                          name={`amount`}
                          control={control}
                          render={({ field: { name, onChange, value } }) => (
                            <QuantityInput
                              name={name}
                              onChange={(value) => onChange(value)}
                              defaultValue={value}
                              max={pin}
                              error={errors?.amount?.message}
                            />
                          )}
                        />
                        <Password
                          label="Password Anda"
                          placeholder="Ketikkan password"
                          {...register('token')}
                          error={errors.token?.message}
                        />
                      </FormBlockWrapper>
                      {tujuan && (
                        <FormBlockWrapper
                          title={'Data Penerima:'}
                          className="hidden pt-7 @2xl:pt-9 @3xl:pt-11"
                        >
                          <Input
                            label="Jenis Member"
                            name="role"
                            value={tujuan?.role}
                            disabled
                          />
                          <Input
                            label="Nama"
                            name="nama"
                            value={tujuan?.nama}
                            disabled
                          />
                        </FormBlockWrapper>
                      )}
                    </div>
                  </div>
                  <div className="-mb-8 flex items-center justify-end gap-4 border-t py-4 dark:bg-gray-50">
                    {tujuan && (
                      <Button
                        variant="outline"
                        className="w-full @xl:w-auto"
                        onClick={rollbackTransfer}
                      >
                        Batal
                      </Button>
                    )}
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      disabled={pin === 0 ? true : isLoading}
                      className="w-full @xl:w-auto"
                    >
                      {tujuan ? 'Transfer Sekarang' : 'Transfer'}
                    </Button>
                  </div>
                </>
              )}
            </Form>
          </div>
        </WidgetCard>
        <HistoryTransferPinTable />
      </div>
    </div>
  );
}
