'use client';

import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import { Alert, Button, TableVariantProps, Text } from 'rizzui';
import { useEffect, useMemo, useRef, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import WidgetCard from '@core/components/cards/widget-card';
import cn from '@core/utils/class-names';
import { UserListItem, UserListResponse } from '@/types/member';
import { PiPencil, PiSignIn, PiTrash } from 'react-icons/pi';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createColumnHelper } from '@tanstack/react-table';
import { UserBankResponse } from '../../pindah-id';
import { toast } from 'react-hot-toast';
import { routes } from '@/config/routes';
import Link from 'next/link';

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

function ApiPagination({
  meta,
  onPageChange,
}: {
  meta: {
    total: number;
    current_page: number;
    per_page: number;
    last_page: number;
  };
  onPageChange: (page: number) => void;
}) {
  if (!meta) return null;

  return (
    <div className="flex items-center justify-between border-t px-4 py-3">
      <div className="text-sm text-gray-600">
        Page {meta.current_page} of {meta.last_page} • Total {meta.total}
      </div>

      <div className="flex gap-2">
        <button
          className="rounded border px-3 py-1 disabled:opacity-50"
          disabled={meta.current_page === 1}
          onClick={() => onPageChange(meta.current_page - 1)}
        >
          Prev
        </button>

        <button
          className="rounded border px-3 py-1 disabled:opacity-50"
          disabled={meta.current_page === meta.last_page}
          onClick={() => onPageChange(meta.current_page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function ManajemenMemberTable({
  className,
  variant = 'modern',
  hideFilters = false,
  hidePagination = false,
}: {
  className?: string;
  hideFilters?: boolean;
  hidePagination?: boolean;
  variant?: TableVariantProps;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);
  const [loadingS, setLoadingS] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({
    total: 0,
    current_page: 1,
    per_page: 100,
    last_page: 1,
  });

  const [username, setUsername] = useState<string>('');
  const [searchBy, setSearchBy] = useState<string>('username');
  const [dataMember, setDataMember] = useState<UserListItem[]>([]);
  const [type, setType] = useState<string>('member');

  const columnHelperNew = createColumnHelper<UserListItem>();

  const columns = [
    {
      id: 'no',
      header: '#',
      size: 60,
      cell: ({ row }: { row: any }) => row.index + 1 + '.',
    },
    columnHelperNew.accessor('id', {
      id: 'aksi',
      size: 150,
      header: 'Aksi',
      enableSorting: false,
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <div className="flex flex-col gap-2 md:flex-row">
            <Link
              href={routes.member.manajemen.edit(id as string)}
              className="inline-flex"
            >
              <Button
                size="sm"
                className="w-full bg-green-300 text-green-900 hover:bg-green-400"
              >
                <PiPencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </Button>
            </Link>
            {/* <Button size="sm" color="danger" variant="flat">
              <PiTrash className="mr-2 h-4 w-4" />
              <span>Hapus</span>
            </Button> */}
            {session?.user?.id === 'adminowner' && (
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
            )}
          </div>
        );
      },
    }),
    columnHelperNew.accessor('attribute.username', {
      id: 'username',
      size: 100,
      header: 'Username',
      cell: (info) => {
        return (
          <Text
            className={`text-xs font-medium uppercase tracking-wider text-yellow-600`}
          >
            {info.getValue()}
          </Text>
        );
      },
    }),
    columnHelperNew.accessor('attribute.nama', {
      id: 'name',
      size: 150,
      header: 'Nama',
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <>
            <Text className="text-sm font-medium text-gray-700">
              {row.original.attribute.nama}
            </Text>
            <Text className="text-xs text-gray-500">
              {row.original.attribute.email}
            </Text>
          </>
        );
      },
    }),
    columnHelperNew.accessor('attribute.no_hp', {
      id: 'hp',
      size: 150,
      header: 'HP',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.province', {
      id: 'alamat',
      size: 150,
      header: 'Alamat',
      cell: ({ row }) => (
        <Text className="text-xs text-gray-700">
          {row.original.attribute.city}, {row.original.attribute.province}
        </Text>
      ),
    }),
    columnHelperNew.accessor('attribute.nik', {
      id: 'nik',
      size: 100,
      header: 'NIK',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.parent_id', {
      id: 'upline',
      size: 100,
      header: 'Upline',
      cell: (info) => (
        <Text className="text-xs uppercase text-gray-700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelperNew.accessor('attribute.sponsor_id', {
      id: 'sponsor',
      size: 100,
      header: 'Sponsor',
      cell: (info) => (
        <Text className="text-xs uppercase text-gray-700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelperNew.accessor('attribute.level', {
      id: 'level',
      size: 100,
      header: 'Level',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.point_left', {
      id: 'point_left',
      size: 100,
      header: 'Point Kiri',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.point_right', {
      id: 'point_right',
      size: 100,
      header: 'Point Kanan',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.bonus_pairing', {
      id: 'bonus_pairing',
      size: 100,
      header: 'Pasangan Bonus',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.heir_name', {
      id: 'heir_name',
      size: 100,
      header: 'Ahli Waris',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.heir_relationship', {
      id: 'heir_relationship',
      size: 100,
      header: 'Status Ahli Waris',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.npwp_name', {
      id: 'npwp_name',
      size: 150,
      header: 'NPWP',
      cell: ({ row }) => (
        <ul>
          <li>
            <Text className="text-xs text-gray-700">
              Nama: {row.original.attribute.npwp_name}
            </Text>
          </li>
          <li>
            <Text className="text-xs text-gray-700">
              Nomor: {row.original.attribute.npwp_number}
            </Text>
          </li>
          <li>
            <Text className="text-xs text-gray-700">
              Alamat: {row.original.attribute.npwp_address}
            </Text>
          </li>
        </ul>
      ),
    }),
    columnHelperNew.accessor('attribute.no_rekening', {
      id: 'no_rekening',
      size: 150,
      header: 'Rekening',
      cell: ({ row }) => (
        <ul>
          <li>
            <Text className="text-xs text-gray-700">
              Bank: {row.original.attribute.nama_bank} -{' '}
              {row.original.attribute.no_rekening}
            </Text>
          </li>
          <li>
            <Text className="text-xs text-gray-700">
              An: {row.original.attribute.nama_pemilik_rekening}
            </Text>
          </li>
        </ul>
      ),
    }),
  ];

  const handleSearch = (query?: string) => {
    fetchDataMember(query);
  };

  const fetchDataMember = (query?: string) => {
    if (!session?.accessToken) return;

    setLoading(true);

    const url = query
      ? `/_users?role=${type}&${searchBy}=${query}`
      : `/_users?role=${type}&page=${page}`;

    fetchWithAuth<UserListResponse>(url, { method: 'GET' }, session.accessToken)
      .then((data) => {
        const metaData = data?.data?.meta ?? null;

        setDataMember(data?.data?.list ?? []);
        setData(data?.data?.list ?? []);
        setMeta(metaData);
      })
      .catch((error) => {
        console.error(error);
        setDataMember([]);
        setData([]);
        setMeta({
          total: 0,
          current_page: 1,
          per_page: 100,
          last_page: 1,
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDataMember();
  }, [session?.accessToken, type, page]);

  // 🧩 Table initialization
  const { table, setData } = useTanStackTable<UserListItem>({
    tableData: dataMember,
    columnConfig: columns,
    options: {
      manualPagination: true, // 🔥 important
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 100,
        },
      },
      enableColumnResizing: false,
    },
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p>Sedang memuat data...</p>
      </div>
    );
  }

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
          <WidgetCard
            className={cn('p-0 lg:p-0', className)}
            title={`Daftar Member`}
            titleClassName="w-[19ch]"
            actionClassName="w-full ps-0 items-center weee"
            headerClassName="mb-6 items-start flex-col @[57rem]:flex-row @[57rem]:items-center px-5 pt-5 lg:pt-7 lg:px-7"
            action={
              <Filters
                table={table}
                type={type}
                setType={setType}
                searchBy={searchBy}
                setSearchBy={setSearchBy}
                username={username}
                setUsername={setUsername}
                handleSearch={handleSearch}
              />
            }
          >
            <Table table={table} variant="modern" />
            {/* <TablePagination table={table} className="p-4" /> */}
            <ApiPagination meta={meta} onPageChange={(p) => setPage(p)} />
          </WidgetCard>
        </div>
      </div>
    </>
  );
}
