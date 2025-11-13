'use client';

import {
  useForm,
  useWatch,
  FormProvider,
  type SubmitHandler,
  Controller,
  useFormContext,
} from 'react-hook-form';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  Input,
  Password,
  Select,
  Text,
  Textarea,
  Title,
} from 'rizzui';
import cn from '@core/utils/class-names';
import { PhoneNumber } from '@core/ui/phone-input';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { UserData, UserDataResponse } from '@/types';
import Swal from 'sweetalert2';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import {
  DaftarStockistInput,
  daftarStockistSchema,
} from '@/validators/daftar-stockist-schema';

export interface StockistRegistrationResponse {
  code: number;
  success: boolean;
  message: string;
  data: StockistRegistrationData;
}

export interface StockistRegistrationData {
  master_username: string;
  username: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string; // use literal union for known statuses
}

function Formnya({
  session,
  isLoading,
  setLoading,
  setSelectedProvinceName,
  setSelectedCityName,
}: {
  session: any;
  isLoading: boolean;
  setLoading: (value: boolean) => void;
  setSelectedProvinceName?: (value: string) => void;
  setSelectedCityName?: (value: string) => void;
}) {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const typeStockist = [
    // {
    //   label: 'Master Stockist',
    //   value: 'master_stockist',
    // },
    {
      label: 'Stockist',
      value: 'stockist',
    },
  ];

  // Watch selected values
  const selectedProvinsi = watch('province');
  const selectedKabupaten = watch('city');

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-1 gap-3 @lg:gap-4 @2xl:gap-5 lg:grid-cols-2'
        )}
      >
        <Title as="h3" className="col-span-full font-semibold text-[#c69731]">
          Form Pendaftaran Stockist
        </Title>

        <Title as="h4" className="col-span-full font-semibold">
          Informasi Sistem
        </Title>

        <div className="col-span-full">
          <Input
            label="Master Username"
            placeholder="Username"
            {...register(`master_username`)}
            // @ts-ignore
            disabled
            className="hidden"
          />
          <Input
            label="Username"
            placeholder="Username"
            {...register(`username`)}
            // @ts-ignore
            error={errors?.username?.message as any}
          />
          <small className="leading-none text-red-600">
            *Harus di Rahasiakan dan Jangan Sama Dengan Username Membership
            Anda, Hindari Penggunaan User ID Stockist yang Di Awali dengan Huruf
            "IPG" karena akan di tolak atau di hapus oleh management.
          </small>
        </div>

        <Controller
          name="type_stockist"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              label="Tipe Stockist/Master Stockist"
              dropdownClassName="!z-10 h-fit"
              inPortal={false}
              placeholder="Pilih Stockist"
              options={typeStockist}
              onChange={onChange}
              value={value}
              getOptionValue={(option) => option.value}
              displayValue={(selected) =>
                typeStockist?.find((con) => con.value === selected)?.label ?? ''
              }
              error={errors?.type_stockist?.message as string}
            />
          )}
        />

        <Input
          label="Email"
          placeholder="Email"
          {...register(`email`)}
          // @ts-ignore
          error={errors?.email?.message as any}
        />

        <div>
          <Password
            label="Password"
            placeholder="Ketikkan password"
            {...register('password')}
            error={errors.password?.message as any}
          />
          <small className="leading-none text-red-600">
            *Harus di Rahasiakan dan Jangan Sama Dengan Password Membership Anda
          </small>
        </div>
        <Password
          label="Konfirmasi Password"
          placeholder="Ketikkan konfirmasi password"
          {...register('confirm_password')}
          error={errors.confirm_password?.message as any}
        />

        <hr className="col-span-full my-5 border-muted" />

        <Title as="h4" className="col-span-full font-semibold">
          Informasi Pribadi
        </Title>

        <Input
          label="Nama Lengkap"
          placeholder="Nama Lengkap"
          {...register(`full_name`)}
          // @ts-ignore
          error={errors?.full_name?.message as any}
          disabled
        />
        <div>
          <Controller
            name="phone"
            control={control}
            render={({ field: { value, onChange } }) => (
              <PhoneNumber
                label="No. HP/WA"
                country="id"
                value={value}
                onChange={onChange}
                // @ts-ignore
                error={errors?.phone?.message as string}
                disabled
              />
            )}
          />
          <small className="leading-none text-red-600">
            *Harus Menggunakan No HP Aktif
          </small>
        </div>

        <Input
          label="Provinsi"
          placeholder="Provinsi"
          {...register('province')}
          value={selectedProvinsi} // 👈 show translated label
          disabled
        />

        <Input
          label="Kota/Kabupaten"
          placeholder="Kota/Kabupaten"
          {...register('city')}
          value={selectedKabupaten} // 👈 show translated label
          disabled
        />

        <style>
          {`
    textarea:-webkit-autofill {
      border-color: inherit !important;
    }
  `}
        </style>
        <Textarea
          label="Alamat"
          placeholder="Alamat"
          {...register('address')}
          error={errors.address?.message as string}
          textareaClassName="h-20"
          autoComplete="off"
        />
      </div>
    </>
  );
}

function Informasi({ isLoading }: { isLoading: boolean }) {
  return (
    <div className={cn('@container @5xl:col-span-4 @5xl:py-0 @6xl:col-span-3')}>
      <div className="overflow-hidden rounded-xl border-2 border-dashed border-primary p-5 shadow-md @sm:p-6 @md:p-7">
        <div className="relative border-b border-gray-300 pb-7">
          <Title as="h6" className="mb-6 text-center">
            Sebelum Klik Tombol Daftar Silahkan Baca Agreement Berikut Ini :
          </Title>
          <div className="flex flex-col">
            <div className="border-b border-gray-300 pb-7 ps-4 text-center @5xl:ps-6">
              <Text as="p" className="mb-2 text-red-600">
                * Tidak Boleh Menggunakan Tanda Kutif (") Atau Aksen (')
              </Text>
              <Text as="p" className="mb-2 text-primary">
                Surat Pernyataan ini saya buat dengan akal sehat dan penuh
                kesadaran saya menjadi mitra bisnis di IPG, maka saya wajib
                setuju dengan persyaratan tanpa ada paksaan oleh siapapun.
              </Text>
            </div>
            <ol className="ms-4 mt-7 list-disc">
              <li>
                <Text as="small" className="text-stone-500">
                  Saya wajib menjaga nama baik perusahaan dan mentaati tata
                  aturan kode etik kemitraan.
                </Text>
              </li>
              <li>
                <Text as="small" className="text-stone-500">
                  Saya berkewajiban menjelaskan sistem pemasaran & manfaat
                  produk sesuai yang ditentukan oleh perusahaan, tidak secara
                  berlebihan dan kebohongan dalam menjelaskan semuanya kepada
                  konsumen atau calon mitra
                </Text>
              </li>
              <li>
                <Text as="small" className="text-stone-500">
                  Saya wajib menjalankan dan mematuhi kode etik perusahaan yang
                  diberlakukan.
                </Text>
              </li>
              <li>
                <Text as="small" className="text-stone-500">
                  Semua bonus yang saya dapatkan di IPG adalah menjadi hak saya,
                  termasuk nilai pungutan pajak akan menjadi tanggungjawab saya
                  100% tidak di bebankan kepada perusahaan.
                </Text>
              </li>
            </ol>
          </div>
        </div>
        <div className="relative py-7">
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full @xl:w-auto"
          >
            Daftar Sekarang
          </Button>
        </div>
      </div>
    </div>
  );
}

// main order form component for create and update order
export default function DaftarStockist({ className }: { className?: string }) {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);
  const [isLoadingS, setLoadingS] = useState(false);

  const router = useRouter();

  const [dataUser, setDataUser] = useState<UserData | null>(null);
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>('');
  const [selectedCityName, setSelectedCityName] = useState<string>('');

  const methods = useForm({
    defaultValues: {
      master_username: '',
      username: '',
      type_stockist: '',
      full_name: '',
      password: '',
      confirm_password: '',
      email: '',
      phone: '',
      province: '',
      city: '',
      address: '',
    },
    resolver: zodResolver(daftarStockistSchema),
  });

  const doRegister = async (payload: any) => {
    if (!session?.accessToken) return;

    setLoadingS(true);

    fetchWithAuth<StockistRegistrationResponse>(
      `/_users/stockist`,
      { method: 'POST', body: JSON.stringify(payload) },
      session.accessToken
    )
      .then((data) => {
        toast.success(
          <Text as="b">Permohonan pendaftaran berhasil dikirim</Text>
        );
        getDataUser();
      })
      .catch((error) => {
        console.error(error);
        // Clear the data so UI can show "no data"
        toast.error(<Text as="b">Permohonan pendaftaran gagal</Text>);
        setLoadingS(false);
      });
  };

  const onSubmit: SubmitHandler<DaftarStockistInput> = (data) => {
    setLoadingS(true);
    Swal.fire({
      title: 'Konfirmasi Pendaftaran',
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
        doRegister(data);
      } else {
        toast.success(<Text as="b">Permohonan pendaftaran dibatalkan!</Text>);
        setLoadingS(false);
      }
    });
  };

  const getDataUser = () => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<UserDataResponse>(
      `/_users`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        const userData = data.data?.attribute;
        setDataUser(userData || null);

        if (userData) {
          // update form values dynamically
          methods.reset({
            ...methods.getValues(),
            master_username: userData?.username ?? '',
            full_name: userData.nama ?? '',
            email: session?.user?.email ?? '',
            phone: userData.no_hp ?? '',
            province: userData.province ?? '',
            city: userData.city ?? '',
            address: '',
          });
        }
      })
      .catch((error) => {
        console.error('Fetch user error:', error);
        setDataUser(null);
      })
      .finally(() => setLoading(false));
  };

  // Fetch data for clone type
  useEffect(() => {
    getDataUser();
  }, [session?.accessToken]);

  // ---- UI rendering ----
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

  if (dataUser.stockist?.hasData) {
    return (
      <Alert variant="flat" color="success" className="mt-5">
        <Text className="font-semibold">Informasi</Text>
        <Text className="break-normal">
          {dataUser.stockist.isPending
            ? 'Pendaftaran Stockist Anda sedang menunggu persetujuan Admin. Silakan menunggu.'
            : 'Selamat! Pendaftaran Stockist Anda telah berhasil disetujui.'}
        </Text>
      </Alert>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={cn(
          'isomorphic-form flex flex-grow flex-col @container [&_label.block>span]:font-medium',
          className
        )}
        autoComplete="off"
      >
        <div className="items-start @5xl:grid @5xl:grid-cols-12 @5xl:gap-7 @6xl:grid-cols-10 @7xl:gap-10">
          <div className="flex-grow @5xl:col-span-8 @5xl:pb-10 @6xl:col-span-7">
            <div className="flex flex-col gap-4 @xs:gap-7 @5xl:gap-9">
              <Formnya
                session={session}
                isLoading={isLoadingS}
                setLoading={setLoadingS}
                setSelectedProvinceName={setSelectedProvinceName}
                setSelectedCityName={setSelectedCityName}
              />
            </div>
          </div>

          <div className="pb-7 pt-10 @container @5xl:col-span-4 @5xl:py-0 @6xl:col-span-3">
            <Informasi isLoading={isLoadingS} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
