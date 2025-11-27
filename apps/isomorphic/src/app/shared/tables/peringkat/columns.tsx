'use client';

import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import { createColumnHelper } from '@tanstack/react-table';
import { Text } from 'rizzui';
import { LeaderboardItem } from '@/types/peringkat';

const columnHelper = createColumnHelper<LeaderboardItem>();

export const listPeringkatColumns = [
  columnHelper.accessor('key', {
    id: 'key',
    header: 'Peringkat',
    size: 60,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('username', {
    id: 'username',
    header: 'Username',
    size: 150,
    cell: (info) => (
      <>
        <Text className="font-medium text-gray-700">{info.getValue()}</Text>
      </>
    ),
  }),
  columnHelper.accessor('attribute.name', {
    id: 'name',
    header: 'Nama',
    size: 150,
    cell: (info) => (
      <Text className="text-xs text-gray-500">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('attribute.amount.currency', {
    id: 'currency',
    header: 'Omset',
    size: 150,
    cell: (info) => (
      <Text className="text-xs text-gray-500">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('attribute.type.leaderboard', {
    id: 'type',
    header: 'Tipe',
    size: 150,
    cell: (info) => getStatusBadge(info.getValue().toString()),
  }),
];
