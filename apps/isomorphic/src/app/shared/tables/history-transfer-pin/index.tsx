'use client';

import Table from '@core/components/table';
import { transactionHistoryColumns } from './columns';
import WidgetCard from '@core/components/cards/widget-card';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import cn from '@core/utils/class-names';
import Filters from './filters';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { HistoryTransferPinItem, HistoryTransferPinResponse } from '@/types';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

export default function HistoryTransferPinTable({
  className,
}: {
  className?: string;
}) {
  const { data: session } = useSession();
  const [dataHistory, setDataHistory] = useState<HistoryTransferPinItem[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [type, setType] = useState<string>('send');

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    const id = session?.user?.id;

    fetchWithAuth<HistoryTransferPinResponse>(
      `/_pins/history-pin/${id}?type=${type}`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setDataHistory(data?.data?.histories);
        setData(data?.data?.histories);
      })
      .catch((error) => {
        console.error(error);
        setDataHistory([]);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken, type]);

  const { table, setData } = useTanStackTable<HistoryTransferPinItem>({
    tableData: dataHistory,
    columnConfig: transactionHistoryColumns,
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
