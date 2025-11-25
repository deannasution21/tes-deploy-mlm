'use client';

import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import { Alert, TableVariantProps, Text } from 'rizzui';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import WidgetCard from '@core/components/cards/widget-card';
import cn from '@core/utils/class-names';
import { memberColumnsNew } from './columns';
import { UserListItem, UserListResponse } from '@/types/member';

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
  const [dataMember, setDataMember] = useState<UserListItem[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [type, setType] = useState<string>('all');

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<UserListResponse>(
      `/_users?role=member`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setDataMember(data?.data?.list ?? []);
        setData(data?.data?.list ?? []);
      })
      .catch((error) => {
        console.error(error);
        setDataMember([]);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  // 🧩 Table initialization
  const { table, setData } = useTanStackTable<UserListItem>({
    tableData: dataMember,
    columnConfig: memberColumnsNew(),
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

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p>Sedang memuat data...</p>
      </div>
    );
  }

  return (
    <>
      <div className="@container">
        <div className="grid grid-cols-1 gap-6 3xl:gap-8">
          <WidgetCard
            className={cn('p-0 lg:p-0', className)}
            title="Daftar Member"
            titleClassName="w-[19ch]"
            actionClassName="w-full ps-0 items-center weee"
            headerClassName="mb-6 items-start flex-col @[57rem]:flex-row @[57rem]:items-center px-5 pt-5 lg:pt-7 lg:px-7"
            action={<Filters table={table} type={type} setType={setType} />}
          >
            <Table table={table} variant="modern" />
            <TablePagination table={table} className="p-4" />
          </WidgetCard>
        </div>
      </div>
    </>
  );
}
