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
import { Text, Input, Button, Select, Password } from 'rizzui';
import { FormBlockWrapper } from '@/app/shared/invoice/form-utils';
import { toast } from 'react-hot-toast';
import WidgetCard from '@core/components/cards/widget-card';
import { signOut, useSession } from 'next-auth/react';
import { UserData, UserDataResponse, OptionType } from '@/types';
import Swal from 'sweetalert2';
import { PhoneNumber } from '@core/ui/phone-input';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { routes } from '@/config/routes';
import { useRouter } from 'next/navigation';
import {
  UbahPasswordInput,
  ubahPasswordSchema,
} from '@/validators/ubah-password-schema';

function Formnya({
  isLoading,
  router,
  role,
}: {
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
          <FormBlockWrapper title={'Password Lama:'}>
            <Input
              label="Username"
              placeholder="Username"
              {...register('username')}
              error={errors?.username?.message as any}
              disabled
              className="hidden"
            />
            <Password
              label="Password Lama"
              placeholder="Ketikkan password lama"
              {...register('old_password')}
              error={errors.old_password?.message as any}
            />
          </FormBlockWrapper>
          <FormBlockWrapper
            title={'Password Baru:'}
            className="pt-7 @2xl:pt-9 @3xl:pt-11"
          >
            <Password
              label="Password Baru"
              placeholder="Ketikkan password baru"
              {...register('new_password')}
              error={errors.new_password?.message as any}
            />
            <Password
              label="Konfirmasi Password"
              placeholder="Ketikkan konfirmasi password"
              {...register('new_match_password')}
              error={errors.new_match_password?.message as any}
            />
          </FormBlockWrapper>
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
          disabled={isLoading}
          className="w-full @xl:w-auto"
        >
          Ubah Data
        </Button>
      </div>
    </>
  );
}

export default function UbahPasswordPage() {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);
  const [isLoadingS, setLoadingS] = useState(false);

  const router = useRouter();

  const [dataUser, setDataUser] = useState<UserData | null>(null);
  const [dataBank, setDataBank] = useState<OptionType[]>([]);

  const doSave = async (payload: any) => {
    if (!session?.accessToken) return;

    setLoadingS(true);

    const body = {
      ...payload,
      type: session?.user?.role ?? 'member',
    };

    fetchWithAuth<any>(
      `/_users/change-password`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      session.accessToken
    )
      .then((data) => {
        toast.success(<Text as="b">Password berhasil diubah</Text>);
        setTimeout(() => {
          signOut();
        }, 300);
      })
      .catch((error) => {
        console.error(error);
        // Clear the data so UI can show "no data"
        toast.error(<Text as="b"> Password gagal diubah</Text>);
      })
      .finally(() => setLoadingS(false));
  };

  const methods = useForm({
    defaultValues: {
      username: session?.user?.id ?? '',
      old_password: '',
      new_password: '',
      new_match_password: '',
    },
    resolver: zodResolver(ubahPasswordSchema),
  });

  const onSubmit: SubmitHandler<UbahPasswordInput> = (data) => {
    setLoadingS(true);

    Swal.fire({
      title: 'Konfirmasi Ubah Password',
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
        toast.success(<Text as="b">Ubah password dibatalkan!</Text>);
        setLoadingS(false);
      }
    });
  };

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<UserDataResponse>(
      `/_users`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        const userData = data?.data?.attribute;
        setDataUser(userData || null);

        if (userData) {
          methods.reset({
            ...methods.getValues(),
          });
        }
      })
      .catch((error) => {
        console.error(error);
        setDataUser(null);
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
          title={<span className="text-[#c69731]">Form Ubah Password</span>}
          titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
        >
          <div>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Formnya
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
