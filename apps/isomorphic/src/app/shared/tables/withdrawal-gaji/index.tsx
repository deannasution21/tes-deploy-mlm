'use client';

import Table from '@core/components/table';
import WidgetCard from '@core/components/cards/widget-card';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import cn from '@core/utils/class-names';
import Filters from './filters';
import { WithdrawalSummaryItem } from '@/types';
import { withdrawalGajiColumns } from './columns';

export default function WithdrawalGajiTable({
  datanya,
  className,
}: {
  datanya: WithdrawalSummaryItem[];
  className?: string;
}) {
  const { table, setData } = useTanStackTable<WithdrawalSummaryItem>({
    tableData: datanya,
    columnConfig: withdrawalGajiColumns,
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
      title="Daftar Akumulasi Gaji"
      titleClassName="w-[19ch]"
      actionClassName="w-full ps-0 items-center"
      headerClassName="mb-6 items-start flex-col @[57rem]:flex-row @[57rem]:items-center px-5 pt-5 lg:pt-7 lg:px-7"
      action={<Filters table={table} />}
    >
      <Table table={table} variant="modern" />
      <TablePagination table={table} className="p-4" />
    </WidgetCard>
  );
}
