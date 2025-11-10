'use client';

import Table from '@core/components/table';
import { WDBonusColumns } from './columns';
import WidgetCard from '@core/components/cards/widget-card';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import cn from '@core/utils/class-names';
import Filters from './filters';
import { UserSummary } from '@/types';

export default function WDBonusTable({
  datanya,
  className,
}: {
  datanya: UserSummary[];
  className?: string;
}) {
  const { table, setData } = useTanStackTable<UserSummary>({
    tableData: datanya,
    columnConfig: WDBonusColumns,
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
      title="History WD Bonus"
      className={cn('p-0 lg:p-0', className)}
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
