'use client';

import { use, useEffect, useState } from 'react';
import { SubmitHandler, Controller } from 'react-hook-form';
import { Form } from '@core/ui/form';
import { Text, Input, ActionIcon, Button, Alert } from 'rizzui';
import { FormBlockWrapper } from '@/app/shared/invoice/form-utils';
import { toast } from 'react-hot-toast';
import WidgetCard from '@core/components/cards/widget-card';
import { PiMinusBold, PiPlusBold } from 'react-icons/pi';
import { useSession } from 'next-auth/react';
import { UserData, UserDataResponse } from '@/types';
import Swal from 'sweetalert2';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import HistoryTransferPointWisataTable from '../tables/history-transfer-point-wisata';
import { PointPromoWisataData, PointPromoWisataResponse } from '@/types/promo';
import {
  TransferPointWisataStockistInput,
  transferPointWisataStockistSchema,
} from '@/validators/transfer-point-promo-wisata-schema';
import { routes } from '@/config/routes';
import { useRouter } from 'next/navigation';

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
      label="Jumlah POINT yang akan ditransfer"
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

export default function TransferPointWisataPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [resetValues, setResetValues] = useState({
    to: '',
    amount: 0,
    role: '',
    nama: '',
  });
  const [isLoading, setLoading] = useState(true);
  const [isLoadingS, setLoadingS] = useState(false);

  const [tujuan, setTujuan] = useState<UserData | null>(null);
  const [dataPin, setDataPin] = useState<PointPromoWisataData | number>(0);

  const getDataPin = async () => {
    if (!session?.accessToken) return;

    setLoading(true);

    const id = session?.user?.id;

    fetchWithAuth<PointPromoWisataResponse>(
      `/_point-promo-wisata`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setDataPin(data?.data?.point_promo_wisata);
      })
      .catch((error) => {
        console.error(error);
        setDataPin(0);
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
      `/_point-promo-wisata/transfer`,
      { method: 'POST', body: JSON.stringify(payload) },
      session.accessToken
    )
      .then((data) => {
        Swal.fire({
          title: 'Transfer Berhasil',
          html: `Selamat anda telah mengirim POINT sebanyak <b>${payload?.amount ?? 0}</b> buah, ke ID <b>${payload?.to_user}</b>!`,
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

  const onSubmit: SubmitHandler<TransferPointWisataStockistInput> = (data) => {
    setLoadingS(true);

    if (!tujuan) {
      getDataTo(data.to?.toLowerCase());
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
              to_user: data.to?.toLowerCase(),
              amount: data.amount,
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

    setLoading(true);

    if (session?.user?.role !== 'stockist') {
      router.push(routes.unauthorized.index);
    } else {
      getDataPin();
    }

    setLoading(false);
  }, [session?.accessToken]);

  if (isLoading)
    return <p className="py-20 text-center">Sedang memuat data...</p>;

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <WidgetCard
          title={<span className="text-[#c69731]">Form Transfer Point</span>}
          titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
        >
          <div>
            <Form<TransferPointWisataStockistInput>
              validationSchema={transferPointWisataStockistSchema}
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
                const currentPinMax = dataPin;
                const isDisabled = currentPinMax === 0;

                return (
                  <>
                    <div className="flex-grow pb-10">
                      <Alert variant="flat" color="success" className="mb-7">
                        <Text className="font-semibold">Informasi</Text>
                        <ol className="list-disc ps-5">
                          <li>
                            <Text className="break-normal">
                              Anda memiliki total <strong>{dataPin}</strong>{' '}
                              POINT PROMO WISATA yang dapat digunakan
                            </Text>
                          </li>
                          <li>
                            <Text className="break-normal">
                              Maksimal <strong>2000</strong> PIN dalam sekali
                              transfer
                            </Text>
                          </li>
                          <li>
                            <Text className="break-normal">
                              Pastikan Username/ID tujuan dalam huruf kecil
                              semua
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
                            inputClassName="[&_input]:lowercase"
                            autoComplete="off"
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
                        disabled={dataPin === 0 ? true : isLoadingS}
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
        <HistoryTransferPointWisataTable />
      </div>
    </div>
  );
}
