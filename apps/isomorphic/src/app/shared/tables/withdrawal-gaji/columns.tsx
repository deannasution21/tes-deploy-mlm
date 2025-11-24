'use client';

import DateCell from '@core/ui/date-cell';
import { createColumnHelper } from '@tanstack/react-table';
import { Text } from 'rizzui';
import { SummaryItem } from '@/types/wd-gaji';

const columnHelper = createColumnHelper<SummaryItem>();

export const withdrawalGajiColumns = [
  {
    id: 'no',
    header: '#',
    size: 60,
    cell: ({ row }: { row: any }) => row.index + 1 + '.',
  },
  columnHelper.accessor('username', {
    id: 'username',
    header: 'Username',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap uppercase">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('balance', {
    id: 'balance',
    header: 'Gaji',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap">{info.getValue().currency}</Text>
    ),
  }),
];
