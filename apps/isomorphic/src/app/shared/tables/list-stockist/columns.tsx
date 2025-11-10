'use client';

import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import { createColumnHelper } from '@tanstack/react-table';
import { Text } from 'rizzui';
import { StockistListDetail } from '@/types';

const columnHelper = createColumnHelper<StockistListDetail>();

export const listStockistColumns = [
  {
    id: 'no',
    header: '#',
    size: 60,
    cell: ({ row }: { row: any }) => row.index + 1 + '.',
  },
  columnHelper.accessor('username', {
    id: 'username',
    header: 'Nama',
    size: 180,
    cell: ({ row }) => (
      <>
        <Text className="text-gray-700">{row.original.full_name}</Text>
        <Text className="text-xs text-gray-500">@{row.original.username}</Text>
      </>
    ),
  }),
  columnHelper.accessor('province', {
    id: 'alamat',
    header: 'Alamat',
    size: 180,
    cell: ({ row }) => (
      <Text className="whitespace-nowrap">
        {row.original.city}, {row.original.province}
      </Text>
    ),
  }),
  columnHelper.accessor('phone_number', {
    id: 'phone_number',
    header: 'No. HP',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap">{info.getValue()}</Text>
    ),
  }),
];
