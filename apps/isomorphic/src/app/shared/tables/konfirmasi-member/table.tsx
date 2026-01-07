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
import {
  UserChangesListItem,
  UserChangesListResponse,
} from '@/types/perubahan-data';
import { PiCheck, PiPencil, PiSignIn, PiTrash, PiX } from 'react-icons/pi';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { createColumnHelper } from '@tanstack/react-table';
import { UserBankResponse } from '../../pindah-id';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { getStatusBadge } from '@core/components/table-utils/get-status-badge';

export default function KonfirmasiMemberTable({
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

  const [username, setUsername] = useState<string>('');
  const [searchBy, setSearchBy] = useState<string>('username');
  const [dataMember, setDataMember] = useState<UserChangesListItem[]>([]);
  const [type, setType] = useState<string>('member');

  const columnHelperNew = createColumnHelper<UserChangesListItem>();

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
            <Button
              size="sm"
              className="w-full bg-green-300 text-green-900 hover:bg-green-400"
              onClick={() =>
                proses({
                  action: 'accepted',
                  username: id,
                  session,
                  setLoadingS,
                })
              }
            >
              <PiCheck className="mr-2 h-4 w-4" />
              <span>Setuju</span>
            </Button>
            <Button
              size="sm"
              className="w-full bg-red-300 text-red-900 hover:bg-red-400"
              onClick={() =>
                proses({
                  action: 'rejected',
                  username: id,
                  session,
                  setLoadingS,
                })
              }
            >
              <PiX className="mr-2 h-4 w-4" />
              <span>Tolak</span>
            </Button>
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
    columnHelperNew.accessor('attribute.changes', {
      id: 'changes',
      size: 250,
      header: 'Perubahan',
      enableSorting: false,
      cell: ({ row }) => {
        const changes = row.original.attribute.changes;

        if (!changes || changes.length === 0) {
          return (
            <Text className="text-xs italic text-gray-400">
              Tidak ada perubahan
            </Text>
          );
        }

        return (
          <div className="space-y-2">
            {changes.map((change, index) => (
              <div
                key={index}
                className="rounded-md border border-gray-200 bg-gray-50 p-2"
              >
                <Text className="text-xs font-semibold capitalize text-gray-700">
                  {change.field}
                </Text>

                <Text className="text-xs text-red-600 line-through">
                  {change.old_value}
                </Text>

                <Text className="text-xs text-green-600">
                  → {change.new_value}
                </Text>
              </div>
            ))}
          </div>
        );
      },
    }),
    columnHelperNew.accessor('attribute.requested_at', {
      id: 'requested_at',
      size: 100,
      header: 'Tanggal Permintaan',
      cell: (info) => (
        <Text className="text-xs text-gray-700">{info.getValue()}</Text>
      ),
    }),
    columnHelperNew.accessor('attribute.accepted_by', {
      id: 'accepted_by',
      size: 100,
      header: 'Disetujui Oleh',
      cell: (info) => (
        <Text className="text-xs uppercase text-gray-700">
          {info ? info.getValue() : '-'}
        </Text>
      ),
    }),
    columnHelperNew.accessor('attribute.rejected_by', {
      id: 'rejected_by',
      size: 100,
      header: 'Ditolak Oleh',
      cell: (info) => (
        <Text className="text-xs uppercase text-gray-700">
          {info ? info.getValue() : '-'}
        </Text>
      ),
    }),
    columnHelperNew.accessor('attribute.status', {
      id: 'attribute.status',
      size: 100,
      header: 'Status',
      cell: (info) => getStatusBadge(info.getValue()),
    }),
  ];

  const proses = ({
    action,
    username,
    session,
    setLoadingS,
  }: {
    action: string;
    username: string;
    session: any;
    setLoadingS: (value: boolean) => void;
  }) => {
    setLoadingS(true);

    Swal.fire({
      title: `${action === 'rejected' ? 'Tolak ' : 'Setujui '}Perubahan Data`,
      html: `Harap pastikan data yang Anda masukkan benar. Jika sudah silakan <strong>LANJUTKAN</strong>`,
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
        fetchWithAuth<UserBankResponse>(
          `/_users/update-member/status`,
          {
            method: 'PUT',
            body: JSON.stringify({
              username: username,
              action: action,
            }),
          },
          session.accessToken
        )
          .then(async (data) => {
            toast.success(`Perubahan data ID: ${username} telah berhasil`);
            fetchDataMember();
          })
          .catch((error) => {
            console.error(error);
            toast.success(`Perubahan data ID: ${username} gagal`);
          })
          .finally(() => setLoadingS(false));
      } else {
        toast.success(<Text as="b">Perubahan data dibatalkan!</Text>);
        setLoadingS(false);
      }
    });
  };

  const handleSearch = (query?: string) => {
    fetchDataMember(query);
  };

  const fetchDataMember = (query?: string) => {
    if (!session?.accessToken) return;

    setLoading(true);

    const url = `/_users?pending_updates=true`;

    fetchWithAuth<UserChangesListResponse>(
      url,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        const metaData = data?.data?.meta ?? null;

        setDataMember(data?.data?.list ?? []);
        setData(data?.data?.list ?? []);
      })
      .catch((error) => {
        console.error(error);
        setDataMember([]);
        setData([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDataMember();
  }, [session?.accessToken, type]);

  // 🧩 Table initialization
  const { table, setData } = useTanStackTable<UserChangesListItem>({
    tableData: dataMember,
    columnConfig: columns,
    options: {
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
              <p className="font-medium text-gray-700">Memproses...</p>
            </div>
          </div>,
          document.body
        )}

      <div className="@container">
        <div className="grid grid-cols-1 gap-6 3xl:gap-8">
          <WidgetCard
            className={cn('p-0 lg:p-0', className)}
            title={`Daftar Pengajuan Data`}
            titleClassName="w-[19ch]"
            actionClassName="w-full ps-0 items-center weee"
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
