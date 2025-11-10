'use client';

import Table from '@core/components/table';
import { historyBonusColumns } from './columns';
import WidgetCard from '@core/components/cards/widget-card';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import cn from '@core/utils/class-names';
import Filters from './filters';
import { BonusItem } from '@/types';

export default function HistoryBonusTable({
  datanya,
  className,
}: {
  datanya: BonusItem[];
  className?: string;
}) {
  const { table, setData } = useTanStackTable<BonusItem>({
    tableData: datanya,
    columnConfig: historyBonusColumns,
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
      className={cn('border-0 p-0 lg:p-0', className)}
      titleClassName="w-[19ch]"
      actionClassName="w-full ps-0 items-center"
      headerClassName="mb-6 items-start flex-col @[57rem]:flex-row @[57rem]:items-center px-5 lg:px-7"
      action={<Filters table={table} />}
    >
      <Table table={table} variant="modern" />
      <TablePagination table={table} className="p-4" />
    </WidgetCard>
  );
}
