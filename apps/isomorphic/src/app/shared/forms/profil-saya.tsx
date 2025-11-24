'use client';

import { use, useEffect, useState } from 'react';
import {
  useForm,
  useWatch,
  FormProvider,
  type SubmitHandler,
  Controller,
  useFormContext,
} from 'react-hook-form';
import { Text, Input, Button, Select } from 'rizzui';
import { FormBlockWrapper } from '@/app/shared/invoice/form-utils';
import { toast } from 'react-hot-toast';
import WidgetCard from '@core/components/cards/widget-card';
import { useSession } from 'next-auth/react';
import {
  UserData,
  UserDataResponse,
  BankStatusResponse,
  OptionType,
} from '@/types';
import Swal from 'sweetalert2';
import { PhoneNumber } from '@core/ui/phone-input';
import {
  ProfilSayaInput,
  profilSayaSchema,
} from '@/validators/profil-saya-schema';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { routes } from '@/config/routes';
import { useRouter } from 'next/navigation';

function Formnya({
  dataBank,
  isLoading,
  router,
  role,
}: {
  dataBank: OptionType[];
  isLoading: boolean;
  router: any;
  role: string;
}) {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <div className="flex-grow pb-10">
        <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12">
          <FormBlockWrapper title={'Informasi Personal:'}>
            <Input
              label="Username"
              placeholder="Username"
              {...register('username')}
              error={errors?.username?.message as any}
              disabled
            />
            <Input
              label="Nama Lengkap"
              placeholder="Nama Lengkap"
              {...register(`nama`)}
              // @ts-ignore
              error={errors?.nama?.message as any}
              disabled
            />
            <Input
              label="Email"
              placeholder="Email"
              {...register(`email`)}
              // @ts-ignore
              error={errors?.email?.message as any}
              disabled
            />
            <Controller
              name="no_hp"
              control={control}
              render={({ field: { value, onChange } }) => (
                <PhoneNumber
                  label="No. HP/WA"
                  country="id"
                  value={value}
                  onChange={onChange}
                  // @ts-ignore
                  error={errors?.no_hp?.message as string}
                  disabled
                />
              )}
            />
          </FormBlockWrapper>
          {role === 'member' && (
            <FormBlockWrapper
              title={'Informasi Bank:'}
              className="pt-7 @2xl:pt-9 @3xl:pt-11"
            >
              <Controller
                control={control}
                name="nama_bank"
                render={({ field: { onChange, value } }) => (
                  <Select
                    label="Bank"
                    dropdownClassName="!z-10 h-fit"
                    inPortal={false}
                    placeholder="Pilih Bank"
                    options={dataBank}
                    onChange={(selectedValue) => {
                      // 🔹 Update form field value
                      onChange(selectedValue);
                    }}
                    value={value}
                    searchable={true}
                    getOptionValue={(option) => option.value}
                    displayValue={(selected) =>
                      dataBank.find((k) => k.value === selected)?.label ?? ''
                    }
                    error={errors?.nama_bank?.message as string | undefined}
                  />
                )}
              />
              <Input
                label="No. Rekening"
                placeholder="No. Rekening"
                {...register(`no_rekening`)}
                // @ts-ignore
                error={errors?.no_rekening?.message as any}
              />
              <Input
                label="Atas Nama"
                placeholder="Atas Nama"
                {...register(`nama_pemilik_rekening`)}
                // @ts-ignore
                error={errors?.nama_pemilik_rekening?.message as any}
              />
            </FormBlockWrapper>
          )}
        </div>
      </div>
      <div className="-mb-4 flex items-center justify-end gap-4 border-t py-4 dark:bg-gray-50">
        <Button
          variant="outline"
          className="w-full @xl:w-auto"
          onClick={() => router.push(routes.dashboard.index)}
        >
          Batal
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={role === 'member' ? isLoading : true}
          className="w-full @xl:w-auto"
        >
          Ubah Data
        </Button>
      </div>
    </>
  );
}

export default function ProfilSayaPage() {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);
  const [isLoadingS, setLoadingS] = useState(false);

  const router = useRouter();

  const [dataUser, setDataUser] = useState<UserData | null>(null);
  const [dataBank, setDataBank] = useState<OptionType[]>([]);

  const doSave = async (payload: any) => {
    if (!session?.accessToken) return;

    setLoadingS(true);

    fetchWithAuth<any>(
      `/_users`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      },
      session.accessToken
    )
      .then((data) => {
        toast.success(<Text as="b">Data berhasil diubah</Text>);
      })
      .catch((error) => {
        console.error(error);
        // Clear the data so UI can show "no data"
        toast.error(<Text as="b"> Data gagal diubah</Text>);
      })
      .finally(() => setLoadingS(false));
  };

  const methods = useForm({
    defaultValues: {
      username: session?.user?.id ?? '',
      nama: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
      no_hp: session?.user?.phone ?? '',
      nama_bank: '',
      nama_pemilik_rekening: '',
      no_rekening: '',
    },
    resolver: zodResolver(profilSayaSchema),
  });

  const onSubmit: SubmitHandler<ProfilSayaInput> = (data) => {
    setLoadingS(true);

    Swal.fire({
      title: 'Konfirmasi Ubah Data',
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
        doSave(data);
      } else {
        toast.success(<Text as="b">Ubah data dibatalkan!</Text>);
        setLoadingS(false);
      }
    });
  };

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    Promise.all([
      fetchWithAuth<UserDataResponse>(
        `/_users`,
        { method: 'GET' },
        session.accessToken
      ),
      fetchWithAuth<BankStatusResponse>(
        `/_services/list-bank`,
        { method: 'GET' },
        session.accessToken
      ),
    ])
      .then(([usersData, bankData]) => {
        const userData = usersData?.data?.attribute;
        setDataUser(userData || null);
        setDataBank(
          (bankData?.data ?? []).map((p: any) => ({
            value: p.bank_code,
            label: p.name.toUpperCase(),
          }))
        );

        if (userData) {
          methods.reset({
            ...methods.getValues(),
            nama_bank: userData.code_bank ?? '',
            nama_pemilik_rekening: userData.nama_pemilik_rekening ?? '',
            no_rekening: userData.no_rekening ?? '',
          });
        }
      })
      .catch((error) => {
        console.error(error);
        setDataUser(null);
        setDataBank([]);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p>Sedang memuat data...</p>
      </div>
    );
  }

  if (!dataUser) {
    return (
      <div className="py-20 text-center text-gray-500">
        <p>Tidak ada data untuk pengguna ini.</p>
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <WidgetCard
          title={<span className="text-[#c69731]">Form Profil Saya</span>}
          titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
        >
          <div>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Formnya
                  dataBank={dataBank}
                  isLoading={isLoadingS}
                  router={router}
                  role={session?.user?.role || 'member'}
                />
              </form>
            </FormProvider>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
