'use client';

import cn from '@core/utils/class-names';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { BankData, BankStatusResponse } from '@/types';
import Table from '@core/components/table';
import { Alert, Button, Text, Title } from 'rizzui';
import { PiSignIn } from 'react-icons/pi';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { getBankNameByCode } from '@/utils/helper';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';
import { createPortal } from 'react-dom';
import WidgetCard from '@core/components/cards/widget-card';
import Filters from '../tables/pindah-id/filters';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import { createColumnHelper } from '@tanstack/react-table';
import TablePagination from '@core/components/table/pagination';

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
  setIsLoggingOut,
}: {
  router: any;
  username: string;
  session: any;
  setLoadingS: (value: boolean) => void;
  setIsLoggingOut: (value: boolean) => void;
}) => {
  setLoadingS(true);
  setIsLoggingOut(true);

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
      setIsLoggingOut(false);
    })
    .finally(() => setLoadingS(false));
};

export default function PindahIDPage({ className }: { className?: string }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);
  const [loadingS, setLoadingS] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [dataUser, setDataUser] = useState<UserBankData | null>(null);
  const [dataIDs, setDataIDs] = useState<ListUser[]>([]);
  const [dataBank, setDataBank] = useState<BankData[]>([]);

  const columnHelper = createColumnHelper<ListUser>();

  const PindahIDColumns = [
    {
      id: 'no',
      header: '#',
      size: 60,
      cell: ({ row }: { row: any }) => row.index + 1 + '.',
    },
    columnHelper.accessor('id', {
      id: 'id',
      header: 'Username',
      size: 180,
      cell: (info) => (
        <Text className="whitespace-nowrap font-medium uppercase">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('id', {
      id: 'login',
      header: 'Login',
      size: 180,
      cell: (info) => {
        const id = info.getValue();
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
                doLogin({
                  router,
                  username: id,
                  session,
                  setLoadingS,
                  setIsLoggingOut,
                })
              }
            >
              <PiSignIn className="mr-2 h-4 w-4" />
              <span>Login ID Ini</span>
            </Button>
          );
        }
      },
    }),
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
        setDataIDs(userData?.data?.list_users || []);
        setData(userData?.data?.list_users || []);
        setDataBank(bankData?.data || []);
      })
      .catch((error) => {
        console.error(error);
        setDataUser(null);
        setDataIDs([]);
        setData([]);
        setDataBank([]);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  const { table, setData } = useTanStackTable<ListUser>({
    tableData: dataIDs,
    columnConfig: PindahIDColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      meta: {},
      enableColumnResizing: false,
    },
  });

  if (isLoading)
    return <p className="py-20 text-center">Sedang memuat data...</p>;

  return (
    <>
      {isLoggingOut &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
            <div className="rounded-lg bg-white p-4 text-center shadow-lg">
              <p className="font-medium text-gray-700">Berpindah akun...</p>
            </div>
          </div>,
          document.body
        )}

      <div className="@container">
        <div className="grid grid-cols-1 gap-6 3xl:gap-8">
          <div className="rounded-lg border border-gray-300 p-5 @3xl:p-7">
            <ul className="grid gap-3">
              <li className="flex items-center gap-1">
                <span className="min-w-28 font-semibold text-gray-900">
                  User ID
                </span>
                <span className="font-semibold text-gray-900">:</span>
                <span className="uppercase">
                  {dataUser?.detail_users?.username}
                </span>
              </li>
              <li className="flex items-center gap-1">
                <span className="min-w-28 font-semibold text-gray-900">
                  Nama
                </span>
                <span className="font-semibold text-gray-900">:</span>
                <span>{dataUser?.detail_users?.name}</span>
              </li>
              <li className="flex items-center gap-1">
                <span className="min-w-28 font-semibold text-gray-900">
                  Bank
                </span>
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

          <WidgetCard
            title="Daftar ID Anda"
            description="ID dengan rekening yang sama"
            className={cn('p-0 lg:p-0', className)}
            titleClassName="w-[19ch]"
            actionClassName="w-full ps-0 items-center"
            headerClassName="mb-6 items-start flex-col @[57rem]:flex-row @[57rem]:items-center px-5 pt-5 lg:pt-7 lg:px-7"
            action={<Filters table={table} />}
          >
            <Table table={table} variant="modern" />
            <TablePagination table={table} className="p-4" />
          </WidgetCard>
        </div>
      </div>
    </>
  );
}
