'use client';

import { use, useEffect, useState } from 'react';
import { SubmitHandler, Controller } from 'react-hook-form';
import { Form } from '@core/ui/form';
import { Text, Input, ActionIcon, Button, Alert, Select } from 'rizzui';
import { FormBlockWrapper } from '@/app/shared/invoice/form-utils';
import { toast } from 'react-hot-toast';
import WidgetCard from '@core/components/cards/widget-card';
import { PiMinusBold, PiPlusBold } from 'react-icons/pi';
import {
  TransferPinStockistInput,
  transferPinStockistSchema,
} from '@/validators/transfer-pin-schema';
import { useSession } from 'next-auth/react';
import {
  UserData,
  UserDataResponse,
  DealerSummaryResponse,
  DealerSummaryData,
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
  disabled,
}: {
  name?: string;
  error?: string;
  onChange?: (value: number) => void;
  value?: number; // ✅ controlled by parent (from RHF)
  max: number;
  disabled?: boolean;
}) {
  const finalMax = Math.min(max, 2000);

  function handleIncrement() {
    if (disabled || value === undefined) return;
    const newValue = Math.min(value + 1, finalMax);
    onChange?.(newValue);
  }

  function handleDecrement() {
    if (disabled || value === undefined) return;
    const newValue = Math.max(value - 1, 1);
    onChange?.(newValue);
  }

  function handleOnChange(inputValue: number) {
    if (disabled) return;
    let newValue = Number(inputValue);
    if (isNaN(newValue)) newValue = 1;
    if (newValue < 1) newValue = 1;
    if (newValue > finalMax) newValue = finalMax;
    onChange?.(newValue);
  }

  const isDisabled = disabled || finalMax === 0;

  return (
    <Input
      label="Jumlah PIN yang akan ditransfer"
      type="number"
      min={1}
      max={finalMax}
      name={name}
      value={value ?? 1} // ✅ controlled by prop
      placeholder="1"
      disabled={isDisabled}
      onChange={(e) => handleOnChange(Number(e.target.value))}
      suffix={
        <>
          <ActionIcon
            title="Decrement"
            size="sm"
            variant="outline"
            className="scale-90 shadow-sm"
            disabled={isDisabled || (value ?? 1) <= 1}
            onClick={handleDecrement}
          >
            <PiMinusBold className="h-3.5 w-3.5" strokeWidth={2} />
          </ActionIcon>
          <ActionIcon
            title="Increment"
            size="sm"
            variant="outline"
            className="scale-90 shadow-sm"
            disabled={isDisabled || (value ?? 1) >= finalMax}
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
  const [resetValues, setResetValues] = useState({
    to: '',
    amount: 0,
    role: '',
    nama: '',
  });
  const [isLoading, setLoading] = useState(true);
  const [isLoadingS, setLoadingS] = useState(false);

  const [tujuan, setTujuan] = useState<UserData | null>(null);
  const [dataPin, setDataPin] = useState<DealerSummaryData | null>(null);
  const [tipePin, setTipePin] = useState<{ label: string; value: string }[]>(
    []
  );

  const getDataPin = async () => {
    if (!session?.accessToken) return;

    setLoading(true);

    const id = session?.user?.id;

    fetchWithAuth<DealerSummaryResponse>(
      `/_pins/dealer/${session.user?.id}?fetch=summary&status=active`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setDataPin(data?.data);

        // dynamically build select options
        const options = Object.entries(data?.data.summary)
          .filter(([_, count]) => count > 0) // optional: only include those with >0
          .map(([key]) => ({
            label: key === 'plan_a' ? 'PIN Normal' : 'PIN Free',
            value: key,
          }));

        setTipePin(options);
      })
      .catch((error) => {
        console.error(error);
        setDataPin(null);
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

    const pin =
      payload?.type_pin === 'plan_a'
        ? 'PLAN'
        : payload?.type_pin?.toUpperCase();

    fetchWithAuth<any>(
      `/_pins/transfer`,
      { method: 'POST', body: JSON.stringify(payload) },
      session.accessToken
    )
      .then((data) => {
        Swal.fire({
          title: 'Transfer Berhasil',
          html: `Selamat anda telah mengirim PIN <b>${pin}</b> sebanyak <b>${payload?.amount ?? 0}</b> buah, ke ID <b>${payload?.to}</b>!`,
          confirmButtonText: 'Tutup',
          showConfirmButton: true,
          confirmButtonColor: '#ca8a04',
          allowOutsideClick: false, // 🔒 disable click outside
          allowEscapeKey: false, // 🔒 disable ESC
          allowEnterKey: true,
        }).then(() => {
          getDataPin();
          rollbackTransfer();
          setLoadingS(false);
        });
      })
      .catch((error) => {
        toast.error(<Text as="b">Transfer PIN Gagal</Text>);
        console.error(error);
        setLoadingS(false);
      });
  };

  const rollbackTransfer = () => {
    setResetValues({
      to: '',
      amount: 0,
      role: '',
      nama: '',
    });
    setTujuan(null);
  };

  const onSubmit: SubmitHandler<TransferPinStockistInput> = (data) => {
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
            <Form<TransferPinStockistInput>
              validationSchema={transferPinStockistSchema}
              onSubmit={onSubmit}
              resetValues={resetValues}
              useFormProps={{
                defaultValues: {
                  amount: 0,
                },
              }}
              className="flex flex-grow flex-col @container [&_label]:font-medium"
            >
              {({
                register,
                control,
                watch,
                setValue,
                reset,
                formState: { errors },
              }) => {
                const selectedType = watch('type_pin');
                const currentPinMax = selectedType
                  ? (dataPin?.summary?.[selectedType] ?? 0)
                  : 0;
                const isDisabled = !selectedType || currentPinMax === 0;

                return (
                  <>
                    <div className="flex-grow pb-10">
                      <Alert variant="flat" color="success" className="mb-7">
                        <Text className="font-semibold">Informasi</Text>
                        <ol className="list-disc ps-5">
                          <li>
                            <Text className="break-normal">
                              Anda memiliki total{' '}
                              <strong>{dataPin?.count}</strong> PIN yang dapat
                              digunakan
                            </Text>
                          </li>
                          {dataPin &&
                            Object.entries(dataPin.summary).map(
                              ([plan, count]) => (
                                <li>
                                  <Text className="break-normal">
                                    Anda memiliki{' '}
                                    <strong className="uppercase">
                                      {count} PIN{' '}
                                      {plan === 'plan_a' ? 'PLAN' : plan}
                                    </strong>
                                  </Text>
                                </li>
                              )
                            )}
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
                            name="type_pin"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Select
                                label="Tipe PIN"
                                dropdownClassName="!z-10 h-fit"
                                inPortal={false}
                                placeholder="Pilih Tipe PIN"
                                options={tipePin}
                                onChange={(val) => {
                                  onChange(val);
                                  setValue('amount', 0);
                                }}
                                value={value}
                                getOptionValue={(option) => option.value}
                                displayValue={(selected) =>
                                  tipePin?.find((con) => con.value === selected)
                                    ?.label ?? ''
                                }
                                error={
                                  errors?.type_pin?.message as
                                    | string
                                    | undefined
                                }
                              />
                            )}
                          />
                          <Controller
                            name="amount"
                            control={control}
                            render={({ field: { name, onChange, value } }) => (
                              <QuantityInput
                                name={name}
                                value={value}
                                onChange={onChange}
                                max={currentPinMax}
                                disabled={isDisabled}
                                error={errors?.amount?.message}
                              />
                            )}
                          />

                          {/* <Password
                            label="Password Anda"
                            placeholder="Ketikkan password"
                            {...register('token')}
                            error={errors.token?.message}
                          /> */}
                        </FormBlockWrapper>
                        {tujuan && (
                          <FormBlockWrapper
                            title={'Data Penerima:'}
                            className="pt-7 @2xl:pt-9 @3xl:pt-11"
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
                          disabled={isLoadingS}
                          onClick={rollbackTransfer}
                        >
                          Batal
                        </Button>
                      )}
                      <Button
                        type="submit"
                        isLoading={isLoadingS}
                        disabled={dataPin?.count === 0 ? true : isLoadingS}
                        className="w-full @xl:w-auto"
                      >
                        {tujuan ? 'Transfer Sekarang' : 'Transfer'}
                      </Button>
                    </div>
                  </>
                );
              }}
            </Form>
          </div>
        </WidgetCard>
        <HistoryTransferPinTable />
      </div>
    </div>
  );
}
