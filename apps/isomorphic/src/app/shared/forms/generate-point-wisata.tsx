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
import Swal from 'sweetalert2';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { PointPromoWisataResponse } from '@/types/promo';
import { routes } from '@/config/routes';
import { useRouter } from 'next/navigation';
import {
  GeneratePointWisataInput,
  generatePointWisataSchema,
} from '@/validators/generate-point-promo-wisata-schema';
import HistoryGeneratePointWisataTable from '../tables/history-generate-point-wisata';

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
      label="Jumlah POINT yang akan digenerate"
      type="number"
      min={1}
      name={name}
      value={value ?? 1}
      placeholder="1"
      disabled={isDisabled}
      onChange={(e) => {
        const val = Number(e.target.value);

        // prevent NaN & value < 1
        if (!val || val < 1) {
          handleOnChange(1);
          return;
        }

        handleOnChange(val);
      }}
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
            disabled={isDisabled} // ❌ hapus limit max
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

export default function GeneratePointWisataPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [resetValues, setResetValues] = useState({
    amount: 0,
  });
  const [isLoading, setLoading] = useState(true);
  const [isLoadingS, setLoadingS] = useState(false);

  const [dataPin, setDataPin] = useState<number>(0);

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

  const doTransfer = async (payload: any) => {
    if (!session?.accessToken) return;

    setLoadingS(true);

    fetchWithAuth<any>(
      `/_point-promo-wisata/generate`,
      { method: 'POST', body: JSON.stringify(payload) },
      session.accessToken
    )
      .then((data) => {
        Swal.fire({
          title: 'Generate Berhasil',
          html: `Selamat anda telah menggenerate POINT sebanyak <b>${payload?.amount ?? 0}</b> buah!`,
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
        toast.error(<Text as="b">Generate POINT Gagal</Text>);
        console.error(error);
        setLoadingS(false);
      });
  };

  const rollbackTransfer = () => {
    setResetValues({
      amount: 0,
    });
  };

  const onSubmit: SubmitHandler<GeneratePointWisataInput> = (data) => {
    setLoadingS(true);

    Swal.fire({
      title: 'Konfirmasi Generate',
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
        doTransfer({
          amount: data.amount,
        });
      } else {
        toast.success(<Text as="b">Generate dibatalkan!</Text>);
        setLoadingS(false);
      }
    });
  };

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    if (
      session?.user?.role !== 'stockist' ||
      session?.user?.id !== 'adminpin2026'
    ) {
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
          title={<span className="text-[#c69731]">Form Generate Point</span>}
          titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
        >
          <div>
            <Form<GeneratePointWisataInput>
              validationSchema={generatePointWisataSchema}
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
                              POINT PROMO WISATA
                            </Text>
                          </li>
                        </ol>
                      </Alert>

                      <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12">
                        <FormBlockWrapper title={'Data POINT:'}>
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
                      </div>
                    </div>
                    <div className="-mb-4 flex items-center justify-end gap-4 border-t py-4 dark:bg-gray-50">
                      <Button
                        variant="outline"
                        className="w-full @xl:w-auto"
                        disabled={isLoadingS}
                        onClick={rollbackTransfer}
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        isLoading={isLoadingS}
                        disabled={isLoadingS}
                        className="w-full @xl:w-auto"
                      >
                        Generate
                      </Button>
                    </div>
                  </>
                );
              }}
            </Form>
          </div>
        </WidgetCard>
        <HistoryGeneratePointWisataTable />
      </div>
    </div>
  );
}
