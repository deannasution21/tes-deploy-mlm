'use client';

import Table from '@core/components/table';
import { transactionHistoryColumns } from './columns';
import WidgetCard from '@core/components/cards/widget-card';
import { transactionHistory } from '@/data/transaction-history';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import cn from '@core/utils/class-names';
import Filters from './filters';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { HistoryTransferPinItem, HistoryTransferPinResponse } from '@/types';

export default function HistoryTransferPinTable({
  className,
}: {
  className?: string;
}) {
  const { data: session } = useSession();
  const [dataHistory, setDataHistory] = useState<HistoryTransferPinItem[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [type, setType] = useState<string>('received');

  useEffect(() => {
    const getDataHistory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/_pins/history-pin/${session?.user?.id}?type=${type}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-app-token': session?.accessToken ?? '',
            },
          }
        );

        if (!res.ok) throw new Error(`HTTP error! ${res.status}`);

        const data = (await res.json()) as HistoryTransferPinResponse;
        setDataHistory(data?.data?.histories);
        setData(data?.data?.histories); // <--- ADD THIS LINE
      } catch (error) {
        console.error('Fetch data error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) getDataHistory();
  }, [session?.accessToken, type]);

  const { table, setData } = useTanStackTable<HistoryTransferPinItem>({
    tableData: dataHistory,
    columnConfig: transactionHistoryColumns,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 7,
        },
      },
      meta: {},
      enableColumnResizing: false,
    },
  });
  return (
    <WidgetCard
      className={cn('p-0 lg:p-0', className)}
      title="History Transfer Pin"
      titleClassName="w-[19ch]"
      actionClassName="w-full ps-0 items-center"
      headerClassName="mb-6 items-start flex-col @[57rem]:flex-row @[57rem]:items-center px-5 pt-5 lg:pt-7 lg:px-7"
      action={<Filters table={table} type={type} setType={setType} />}
    >
      <Table table={table} variant="modern" />
      <TablePagination table={table} className="p-4" />
    </WidgetCard>
  );
}
