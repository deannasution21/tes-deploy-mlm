'use client';

import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import { createColumnHelper } from '@tanstack/react-table';
import { Text } from 'rizzui';
import { LeaderboardAttribute, LeaderboardItem } from '@/types/top-income';

const columnHelper = createColumnHelper<LeaderboardItem>();

export const topIncomeColumns = [
  {
    id: 'no',
    header: '#',
    size: 60,
    cell: ({ row }: { row: any }) => row.index + 1 + '.',
  },
  columnHelper.accessor('attribute.name', {
    id: 'name',
    header: 'Nama',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('attribute.amount.currency', {
    id: 'amount',
    header: 'Income',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('attribute.type.label', {
    id: 'type',
    header: 'Type',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap">{info.getValue()}</Text>
    ),
  }),
];
