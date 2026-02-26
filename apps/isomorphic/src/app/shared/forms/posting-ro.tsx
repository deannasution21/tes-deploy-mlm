'use client';

import { use, useEffect, useState } from 'react';
import {
  SubmitHandler,
  Controller,
  useFormContext,
  FormProvider,
  useForm,
} from 'react-hook-form';
import { Form } from '@core/ui/form';
import { Text, Input, ActionIcon, Button, Alert, Select } from 'rizzui';
import { FormBlockWrapper } from '@/app/shared/invoice/form-utils';
import { toast } from 'react-hot-toast';
import WidgetCard from '@core/components/cards/widget-card';
import { useSession } from 'next-auth/react';
import { UserData, OptionType, Pin, PinResponse } from '@/types';
import Swal from 'sweetalert2';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import {
  PostingROInput,
  postingROSchema,
} from '@/validators/posting-ro-schema';
import cn from '@core/utils/class-names';
import { zodResolver } from '@hookform/resolvers/zod';

function Formnya({
  dataPin,
  dataPin2,
  session,
}: {
  dataPin: OptionType[];
  dataPin2: Pin[];
  session: any;
}) {
  const {
    control,
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const [selectedPin, setSelectedPin] = useState<string>('');
  const [dataSPin, setDataSPin] = useState<Pin>();

  useEffect(() => {
    if (dataSPin) {
      setValue('mlm_user_id', dataSPin.mlm_user_id?.toLowerCase()); // ✅ update RHF state
      setValue('type_plan', dataSPin?.type); // ✅ sync state to form
    }
  }, [dataSPin, setValue]);

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-1 gap-3 @lg:gap-4 @2xl:gap-5 lg:grid-cols-2'
        )}
      >
        {/* PIN Kosong */}
        <Controller
          control={control}
          name="pin_code"
          render={({ field: { onChange, value } }) => (
            <Select
              label="PIN"
              dropdownClassName="!z-10 h-fit max-h-[250px]"
              inPortal={false}
              placeholder="Pilih PIN"
              options={dataPin}
              onChange={(selectedId) => {
                // Find the selected pin object
                const selectedOption = dataPin.find(
                  (p) => p.value === selectedId
                );
                const selectedPinData = dataPin2.find(
                  (p) => p.pin_code === selectedId
                );

                // ✅ Update form and states
                onChange(selectedId); // store pin_code to form field
                setSelectedPin?.(selectedOption?.label ?? ''); // store pin name or label
                setDataSPin(selectedPinData); // ✅ store mlm_user_id
              }}
              value={value}
              searchable={true}
              getOptionValue={(option) => option.value}
              displayValue={(selected) =>
                dataPin.find((p) => p.value === selected)?.label ?? ''
              }
              error={errors?.pin_code?.message as string | undefined}
            />
          )}
        />

        <Controller
          name="mlm_user_id"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Input
              label="ID Yang Terbentuk"
              placeholder="(Otomatis by system)"
              {...field}
              inputClassName="[&_input]:uppercase"
              error={error?.message as any}
              disabled
            />
          )}
        />
      </div>
    </>
  );
}

export default function PostingROPage() {
  const { data: session } = useSession();
  const [resetValues, setResetValues] = useState({
    pin_code: '',
    mlm_user_id: '',
    type_plan: '',
  });
  const [isLoading, setLoading] = useState(true);
  const [isLoadingS, setLoadingS] = useState(false);

  const [dataPin, setDataPin] = useState<OptionType[]>([]);
  const [dataPin2, setDataPin2] = useState<Pin[]>([]);

  const getDataPin = async () => {
    if (!session?.accessToken) return;

    setLoading(true);

    const id = session?.user?.id;

    fetchWithAuth<PinResponse>(
      `/_pins/dealer/${session?.user?.id}?type=plan_a&fetch=all&status=active`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setDataPin(
          (data?.data?.pins ?? []).map((p: any) => ({
            value: p.pin_code,
            label: p.pin_code,
          }))
        );
        setDataPin2(data?.data?.pins ?? []);
      })
      .catch((error) => {
        console.error(error);
        setDataPin([]);
        setDataPin2([]);
      })
      .finally(() => setLoading(false));
  };

  const methodsPosting = useForm({
    defaultValues: {
      pin_code: '',
      mlm_user_id: '',
      type_plan: '',
    },
    resolver: zodResolver(postingROSchema),
  });

  const doPosting = async (payload: any) => {
    if (!session?.accessToken) return;

    setLoadingS(true);

    const body = {
      ...payload,
      mode: 'ro',
    };

    fetchWithAuth<any>(
      `/_network-diagrams`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      session.accessToken
    )
      .then((data) => {
        toast.success(<Text as="b">Posting Berhasil!</Text>);
        methodsPosting.reset({
          pin_code: '',
          mlm_user_id: '',
          type_plan: '',
        });
        getDataPin();
        setLoadingS(false);
      })
      .catch((error) => {
        console.error(error);
        // Clear the data so UI can show "no data"
        toast.error(<Text as="b"> Posting gagal</Text>);
        setLoadingS(false);
      });
  };

  const rollbackTransfer = () => {
    setResetValues({
      pin_code: '',
      mlm_user_id: '',
      type_plan: '',
    });
  };

  const onSubmit: SubmitHandler<PostingROInput> = (data) => {
    setLoadingS(true);

    Swal.fire({
      title: 'Konfirmasi Posting RO',
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
        doPosting(data);
      } else {
        toast.success(<Text as="b">Posting dibatalkan!</Text>);
        setLoadingS(false);
      }
    });
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
          title={<span className="text-[#c69731]">Form Posting RO</span>}
          titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
        >
          <div>
            <FormProvider {...methodsPosting}>
              <form
                autoComplete="off"
                onSubmit={methodsPosting.handleSubmit(onSubmit)}
                className="isomorphic-form flex flex-grow flex-col @container [&_label.block>span]:font-medium"
              >
                <div className="mb-10 flex flex-col gap-4 @xs:gap-7 @5xl:gap-9">
                  <Formnya
                    dataPin={dataPin}
                    dataPin2={dataPin2}
                    session={session}
                  />
                </div>
                <div className="-mb-4 flex items-center justify-end gap-4 border-t py-4 dark:bg-gray-50">
                  <Button
                    type="submit"
                    isLoading={isLoadingS}
                    disabled={isLoadingS}
                    className="w-full @xl:w-auto"
                  >
                    Posting Sekarang
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
