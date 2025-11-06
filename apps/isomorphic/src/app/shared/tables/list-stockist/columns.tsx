'use client';

import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import { createColumnHelper } from '@tanstack/react-table';
import { Text } from 'rizzui';
import { Pin } from '@/types';

const statusColorClassName = {
  Complete: 'text-green-dark before:bg-green-dark',
  Pending: 'before:bg-orange text-orange-dark',
  Canceled: 'text-red-dark before:bg-red-dark',
};

const columnHelper = createColumnHelper<Pin>();

export const listStockistColumns = [
  {
    id: 'no',
    header: '#',
    size: 60,
    cell: ({ row }: { row: any }) => row.index + 1 + '.',
  },
  columnHelper.accessor('dealer_id', {
    id: 'dealer_id',
    header: 'Nama',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap font-medium">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('mlm_user_id', {
    id: 'mlm_user_id',
    header: 'Alamat',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap">
        Jl. Berdikari Gg Kemakmuran No. 07
      </Text>
    ),
  }),
  columnHelper.accessor('dealer_id', {
    id: 'dealer_id',
    header: 'No. HP',
    size: 180,
    cell: (info) => <Text className="whitespace-nowrap">081-234-567-89</Text>,
  }),
];
