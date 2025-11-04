'use client';

import cn from '@core/utils/class-names';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { BankData, BankStatusResponse } from '@/types';
import BasicTableWidget from '@core/components/controlled-table/basic-table-widget';
import { Alert, Button, Text, Title } from 'rizzui';
import { PiSignIn } from 'react-icons/pi';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { getBankNameByCode } from '@/utils/helper';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';

// ✅ TypeScript Interfaces
export interface UserBankResponse {
  code: number;
  success: boolean;
  message: string;
  data: UserBankData;
}

export interface UserBankData {
  detail_users: DetailUser;
  count: number;
  list_users: ListUser[];
}

export interface DetailUser {
  username: string;
  name: string;
  bank_name: string;
  account_number: string;
  account_name: string;
}

export interface ListUser {
  id: string;
  attribute: UserAttribute;
}

export interface UserAttribute {
  nama: string;
  username: string;
  email: string;
  no_hp: string;
  nama_bank: string;
  no_rekening: string;
  nama_pemilik_rekening: string;
  role: string;
  status: UserStatus;
}

export interface UserStatus {
  code: number;
  name: string;
}

const doLogin = ({
  router,
  username,
  session,
  setLoadingS,
}: {
  router: any;
  username: string;
  session: any;
  setLoadingS: (value: boolean) => void;
}) => {
  setLoadingS(true);

  fetchWithAuth<UserBankResponse>(
    `/_auth/sign-in-as-user`,
    {
      method: 'POST',
      body: JSON.stringify({
        username: username,
      }),
    },
    session.accessToken
  )
    .then(async (data) => {
      const res = await signIn('credentials', {
        redirect: false,
        username: username,
        via: 'pindah',
        token: session?.accessToken,
      });

      if (res?.error) {
        toast.error('Login gagal');
        return;
      }
      setTimeout(() => {
        toast.success(`Berhasil pindah ke ID: ${username}`);
        router.push(routes.dashboard.index);
      }, 300);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => setLoadingS(false));
};

export default function PindahIDTable({ className }: { className?: string }) {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);
  const [loadingS, setLoadingS] = useState(false);

  const [dataUser, setDataUser] = useState<UserBankData | null>(null);
  const [dataBank, setDataBank] = useState<BankData[]>([]);

  const router = useRouter();

  const getColumns = () => [
    {
      title: <span className="ml-6 block">No</span>,
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (_: any, __: any, index: number) => (
        <Text className="ml-6 text-gray-700">{index + 1}.</Text>
      ),
    },
    {
      title: 'Username',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      render: (id: string) => (
        <Text className="font-medium text-gray-700">{id}</Text>
      ),
    },
    {
      title: 'Login',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      render: (id: string, row: any) => {
        if (session?.user?.id === id) {
          return (
            <Button size="sm" disabled>
              <PiSignIn className="mr-2 h-4 w-4" />
              <span>Login ID Ini</span>
            </Button>
          );
        } else {
          return (
            <Button
              size="sm"
              isLoading={loadingS}
              disabled={loadingS}
              onClick={() =>
                doLogin({ router, username: id, session, setLoadingS })
              }
            >
              <PiSignIn className="mr-2 h-4 w-4" />
              <span>Login ID Ini</span>
            </Button>
          );
        }
      },
    },
  ];

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    Promise.all([
      fetchWithAuth<UserBankResponse>(
        `/_users/by-bank-account`,
        { method: 'GET' },
        session.accessToken
      ),
      fetchWithAuth<BankStatusResponse>(
        `/_services/list-bank`,
        { method: 'GET' },
        session.accessToken
      ),
    ])
      .then(([userData, bankData]) => {
        setDataUser(userData?.data || null);
        setDataBank(bankData?.data || []);
      })
      .catch((error) => {
        console.error(error);
        setDataUser(null);
        setDataBank([]);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  if (isLoading)
    return <p className="py-20 text-center">Sedang memuat data...</p>;

  return (
    <>
      <div className="mb-6 grid gap-6 @2xl:grid-cols-2 @3xl:mb-10 @3xl:gap-10">
        <div className="rounded-lg border border-gray-300 p-5 @3xl:p-7">
          <ul className="grid gap-3">
            <li className="flex items-center gap-1">
              <span className="min-w-28 font-semibold text-gray-900">
                User ID
              </span>
              <span className="font-semibold text-gray-900">:</span>
              <span>{dataUser?.detail_users?.username}</span>
            </li>
            <li className="flex items-center gap-1">
              <span className="min-w-28 font-semibold text-gray-900">Nama</span>
              <span className="font-semibold text-gray-900">:</span>
              <span>{dataUser?.detail_users?.name}</span>
            </li>
            <li className="flex items-center gap-1">
              <span className="min-w-28 font-semibold text-gray-900">Bank</span>
              <span className="font-semibold text-gray-900">:</span>
              <span className="uppercase">
                {dataUser?.detail_users?.bank_name
                  ? getBankNameByCode(
                      dataBank,
                      dataUser?.detail_users?.bank_name
                    )
                  : '-'}
              </span>
            </li>
            <li className="flex items-center gap-1">
              <span className="min-w-28 font-semibold text-gray-900">
                No. Rekening
              </span>
              <span className="font-semibold text-gray-900">:</span>
              <span>{dataUser?.detail_users?.account_number}</span>
            </li>
            <li className="flex items-center gap-1">
              <span className="min-w-28 font-semibold text-gray-900">
                Atas Nama
              </span>
              <span className="font-semibold text-gray-900">:</span>
              <span>{dataUser?.detail_users?.account_name}</span>
            </li>
          </ul>
          <Alert variant="flat" color="success" className="mt-5">
            <Text className="font-semibold">Informasi</Text>
            <Text className="break-normal">
              Anda memiliki total <strong>{dataUser?.count ?? 0} ID</strong>{' '}
              dengan rekening yang sama
            </Text>
          </Alert>
        </div>
      </div>

      <BasicTableWidget
        title="Daftar ID Anda"
        description="ID dengan rekening yang sama"
        className={cn(
          'pb-0 lg:pb-0 [&_.rc-table-row:last-child_td]:border-b-0'
        )}
        data={dataUser?.list_users ?? []}
        getColumns={getColumns}
        noGutter
        enableSearch={false}
        scroll={{
          x: 400,
        }}
      />
    </>
  );
}
