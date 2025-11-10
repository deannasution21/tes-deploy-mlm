'use client';

import DateCell from '@core/ui/date-cell';
import { createColumnHelper } from '@tanstack/react-table';
import { Text } from 'rizzui';
import { BonusItem } from '@/types';

const columnHelper = createColumnHelper<BonusItem>();

export const historyBonusColumns = [
  {
    id: 'no',
    header: '#',
    size: 60,
    cell: ({ row }: { row: any }) => row.index + 1 + '.',
  },
  columnHelper.accessor('attribute.created_at', {
    id: 'created_at',
    header: 'Tanggal',
    size: 180,
    cell: (info) => <DateCell date={new Date(info.getValue())} />,
  }),
  columnHelper.accessor('attribute.from', {
    id: 'from',
    header: 'Dari',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('attribute.total.currency', {
    id: 'total',
    header: 'Komisi',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap">{info.getValue()}</Text>
    ),
  }),
];
