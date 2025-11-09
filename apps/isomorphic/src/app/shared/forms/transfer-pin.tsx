'use client';

import { use, useEffect, useState } from 'react';
import { SubmitHandler, Controller } from 'react-hook-form';
import { Form } from '@core/ui/form';
import {
  Text,
  Input,
  ActionIcon,
  Button,
  Password,
  Alert,
  Select,
} from 'rizzui';
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
import { fetchWithAuth } from '@/utils/fetchWithAuth';

function QuantityInput({
  name,
  error,
  onChange,
  value,
  max,
}: {
  name?: string;
  error?: string;
  onChange?: (value: number) => void;
  value?: number; // ✅ controlled by parent (from RHF)
  max: number;
}) {
  const finalMax = Math.min(max, 2000);

  function handleIncrement() {
    if (value === undefined) return;
    const newValue = Math.min(value + 1, finalMax);
    onChange?.(newValue);
  }

  function handleDecrement() {
    if (value === undefined) return;
    const newValue = Math.max(value - 1, 1);
    onChange?.(newValue);
  }

  function handleOnChange(inputValue: number) {
    let newValue = Number(inputValue);
    if (isNaN(newValue)) newValue = 1;
    if (newValue < 1) newValue = 1;
    if (newValue > finalMax) newValue = finalMax;
    onChange?.(newValue);
  }

  return (
    <Input
      label="Jumlah PIN yang akan ditransfer"
      type="number"
      min={1}
      max={finalMax}
      name={name}
      value={value ?? 1} // ✅ controlled by prop
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
            disabled={finalMax === 0 || (value ?? 1) <= 1}
            onClick={handleDecrement}
          >
            <PiMinusBold className="h-3.5 w-3.5" strokeWidth={2} />
          </ActionIcon>
          <ActionIcon
            title="Increment"
            size="sm"
            variant="outline"
            className="scale-90 shadow-sm"
            disabled={finalMax === 0 || (value ?? 1) >= finalMax}
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
  const [resetValues, setResetValues] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isLoadingS, setLoadingS] = useState(false);

  const [tujuan, setTujuan] = useState<UserData | null>(null);
  const [pin, setPin] = useState<number>(0);

  const tipePin = [
    {
      label: 'PIN Normal',
      value: 'plan_a',
    },
    {
      label: 'PIN Free',
      value: 'free',
    },
  ];

  const getDataPin = async () => {
    if (!session?.accessToken) return;

    setLoading(true);

    const id = session?.user?.id;

    fetchWithAuth<PinResponse>(
      `/_pins/dealer/${id}?fetch=all&type=plan_a&status=active`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setPin(data?.data?.count || 0);
      })
      .catch((error) => {
        console.error(error);
        setPin(0);
      })
      .finally(() => setLoading(false));
  };

  const getDataTo = async (id: string) => {
    if (!session?.accessToken) return;

    setLoadingS(true);

    fetchWithAuth<UserDataResponse>(
      `/_users/${id}`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        toast.success(<Text as="b">Data {id} Ditemukan</Text>);
        setTujuan(data?.data?.attribute ?? null);
      })
      .catch((error) => {
        toast.error(<Text as="b">Data {id} Tidak Ditemukan</Text>);
        console.error(error);
        setTujuan(null);
      })
      .finally(() => setLoadingS(false));
  };

  const doTransfer = async (payload: any) => {
    if (!session?.accessToken) return;

    setLoadingS(true);

    fetchWithAuth<any>(
      `/_pins/transfer`,
      { method: 'POST', body: JSON.stringify(payload) },
      session.accessToken
    )
      .then((data) => {
        toast.success(<Text as="b">Transfer Berhasil!</Text>);
        setTimeout(() => {
          getDataPin();
          rollbackTransfer();
        }, 300);
      })
      .catch((error) => {
        toast.error(<Text as="b">Transfer Gagal</Text>);
        console.error(error);
      })
      .finally(() => setLoadingS(false));
  };

  const rollbackTransfer = () => {
    setResetValues({
      to: null,
      amount: pin > 0 ? 1 : 0,
      token: null,
      role: null,
      nama: null,
    });
    setTujuan(null);
  };

  const onSubmit: SubmitHandler<TransferPinInput> = (data) => {
    setLoadingS(true);

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
              type_pin: data.type_pin,
              note: '',
              token: data.token,
            });
          }
        } else {
          toast.success(<Text as="b">Transfer dibatalkan!</Text>);
          setLoadingS(false);
        }
      });
    }
  };

  useEffect(() => {
    if (!session?.accessToken) return;

    getDataPin();
  }, [session?.accessToken]);

  if (isLoading)
    return <p className="py-20 text-center">Sedang memuat data...</p>;

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <WidgetCard
          title={<span className="text-[#c69731]">Form Transfer PIN</span>}
          titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
        >
          <div>
            <Form<TransferPinInput>
              key={pin}
              validationSchema={transferPinSchema}
              onSubmit={onSubmit}
              useFormProps={{
                defaultValues: {
                  amount: pin > 0 ? 1 : 0,
                },
              }}
              className="flex flex-grow flex-col @container [&_label]:font-medium"
            >
              {({ register, control, watch, reset, formState: { errors } }) => (
                <>
                  <div className="flex-grow pb-10">
                    <Alert variant="flat" color="success" className="mb-7">
                      <Text className="font-semibold">Informasi</Text>
                      <ol className="list-disc ps-5">
                        <li>
                          <Text className="break-normal">
                            Anda memiliki <strong>{pin}</strong> PIN yang dapat
                            digunakan
                          </Text>
                        </li>
                        <li>
                          <Text className="break-normal">
                            Maksimal <strong>2000</strong> PIN dalam sekali
                            transfer
                          </Text>
                        </li>
                      </ol>
                    </Alert>

                    <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12">
                      <FormBlockWrapper title={'Data Pengirim:'}>
                        <Input
                          label="Username Member Tujuan"
                          placeholder="Ketikkan username"
                          {...register('to')}
                          error={errors.to?.message}
                          autoComplete="off"
                        />
                        <Controller
                          name="amount"
                          control={control}
                          render={({ field: { name, onChange, value } }) => (
                            <QuantityInput
                              name={name}
                              value={value} // ✅ controlled
                              onChange={(val) => onChange(val)}
                              max={pin > 2000 ? 2000 : pin}
                              error={errors?.amount?.message}
                            />
                          )}
                        />
                        <Controller
                          name="type_pin"
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <Select
                              label="Tipe PIN"
                              dropdownClassName="!z-10 h-fit"
                              inPortal={false}
                              placeholder="Pilih Tipe PIN"
                              options={tipePin}
                              onChange={onChange}
                              value={value}
                              getOptionValue={(option) => option.value}
                              displayValue={(selected) =>
                                tipePin?.find((con) => con.value === selected)
                                  ?.label ?? ''
                              }
                              error={errors?.type_pin?.message}
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
                  <div className="-mb-4 flex items-center justify-end gap-4 border-t py-4 dark:bg-gray-50">
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
                      isLoading={isLoadingS}
                      disabled={pin === 0 ? true : isLoadingS}
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
