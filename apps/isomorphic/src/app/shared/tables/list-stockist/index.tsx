'use client';

import Table from '@core/components/table';
import { listStockistColumns } from './columns';
import WidgetCard from '@core/components/cards/widget-card';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import cn from '@core/utils/class-names';
import Filters from './filters';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { StockistListDetail, StockistListDetailResponse } from '@/types';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

export default function ListStockistTable({
  className,
}: {
  className?: string;
}) {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);

  const [dataStockist, setDataStockist] = useState<StockistListDetail[]>([]);
  const [type, setType] = useState<string>('received');

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<StockistListDetailResponse>(
      `/_users/stockist?fetch=active`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        const datanya = data?.data?.detail || [];
        setDataStockist(datanya);
        setData(datanya);
      })
      .catch((error) => {
        console.error(error);
        setDataStockist([]);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  const { table, setData } = useTanStackTable<StockistListDetail>({
    tableData: dataStockist,
    columnConfig: listStockistColumns,
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
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <WidgetCard
          className={cn('p-0 lg:p-0', className)}
          title="List Stockist"
          titleClassName="w-[19ch]"
          actionClassName="w-full ps-0 items-center"
          headerClassName="mb-6 items-start flex-col @[57rem]:flex-row @[57rem]:items-center px-5 pt-5 lg:pt-7 lg:px-7"
          action={<Filters table={table} type={type} setType={setType} />}
        >
          <Table table={table} variant="modern" />
          <TablePagination table={table} className="p-4" />
        </WidgetCard>
      </div>
    </div>
  );
}
