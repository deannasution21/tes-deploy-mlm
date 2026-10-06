'use client';

import { useEffect, useState } from 'react';
import {
  useForm,
  FormProvider,
  type SubmitHandler,
  useFormContext,
} from 'react-hook-form';
import { Text, Button, Password } from 'rizzui';
import { FormBlockWrapper } from '@/app/shared/invoice/form-utils';
import { toast } from 'react-hot-toast';
import WidgetCard from '@core/components/cards/widget-card';
import { useSession } from 'next-auth/react';
import { UserData, UserDataResponse } from '@/types';
import Swal from 'sweetalert2';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { routes } from '@/config/routes';
import { useRouter } from 'next/navigation';
import {
  UbahPasswordMemberInput,
  ubahPasswordMemberSchema,
} from '@/validators/ubah-password-member-schema';

function Formnya({
  isLoading,
  router,
}: {
  isLoading: boolean;
  router: any;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <div className="flex-grow pb-10">
        <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12">
          <FormBlockWrapper title={'Password Baru:'}>
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
          onClick={() => router.push(routes.member.manajemen.index)}
        >
          Batal
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full @xl:w-auto"
        >
          Reset Password
        </Button>
      </div>
    </>
  );
}

export default function UbahPasswordMemberPage({
  user_id,
}: {
  user_id?: string;
}) {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);
  const [isLoadingS, setLoadingS] = useState(false);

  const router = useRouter();

  const [dataUser, setDataUser] = useState<UserData | null>(null);

  const methods = useForm({
    defaultValues: {
      username: user_id ?? '',
      new_password: '',
      new_match_password: '',
    },
    resolver: zodResolver(ubahPasswordMemberSchema),
  });

  const doSave = async (payload: any) => {
    if (!session?.accessToken || !user_id) return;

    setLoadingS(true);

    fetchWithAuth<any>(
      `/_users/change-password`,
      {
        method: 'PUT',
        body: JSON.stringify({
          username: user_id,
          new_password: payload?.new_password,
          type: 'member',
        }),
      },
      session.accessToken
    )
      .then((data) => {
        toast.success(<Text as="b">Password member berhasil diubah</Text>);
        methods.reset({
          username: user_id ?? '',
          new_password: '',
          new_match_password: '',
        });
        setTimeout(() => {
          router.push(routes.member.manajemen.index);
        }, 300);
      })
      .catch((error: any) => {
        console.error(error);
        toast.error(
          <Text as="b">
            {error?.message ?? 'Password member gagal diubah'}
          </Text>
        );
      })
      .finally(() => setLoadingS(false));
  };

  const onSubmit: SubmitHandler<UbahPasswordMemberInput> = (data) => {
    Swal.fire({
      title: 'Konfirmasi Reset Password',
      html: `Password akun <strong class="uppercase">${user_id}</strong> akan diubah. Lanjutkan?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Reset',
      cancelButtonText: 'Batal',
      customClass: {
        confirmButton:
          'bg-[#AA8453] hover:bg-[#a16207] text-white font-semibold px-4 py-2 rounded me-3',
        cancelButton:
          'bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded',
      },
      buttonsStyling: false,
    }).then((result: any) => {
      if (result.isConfirmed) {
        doSave(data);
      } else {
        toast.success(<Text as="b">Ubah password dibatalkan!</Text>);
      }
    });
  };

  useEffect(() => {
    if (!session?.accessToken || !user_id) return;

    setLoading(true);

    fetchWithAuth<UserDataResponse>(
      `/_users/${user_id}`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        const userData = data?.data?.attribute;
        setDataUser(userData || null);
      })
      .catch((error) => {
        console.error(error);
        setDataUser(null);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken, user_id]);

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
        <p>Tidak ada data untuk member ini.</p>
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <WidgetCard
          title={
            <span className="text-[#c69731]">
              Reset Password Member: {dataUser?.username?.toUpperCase()}
            </span>
          }
          titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
        >
          <Text className="-mt-3 mb-5 text-gray-500">
            Password lama member akan langsung tidak berlaku. Informasikan
            password baru kepada member yang bersangkutan.
          </Text>
          <div>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Formnya isLoading={isLoadingS} router={router} />
              </form>
            </FormProvider>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
