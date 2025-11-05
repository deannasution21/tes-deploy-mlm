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

export const dataPinsColumns = [
  {
    id: 'no',
    header: '#',
    size: 60,
    cell: ({ row }: { row: any }) => row.index + 1 + '.',
  },
  columnHelper.accessor('pin_code', {
    id: 'pin_code',
    header: 'PIN',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap font-medium">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('mlm_user_id', {
    id: 'mlm_user_id',
    header: 'Username',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('dealer_id', {
    id: 'dealer_id',
    header: 'Nama',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('status', {
    id: 'status',
    size: 100,
    header: 'Status',
    cell: (info) => getStatusBadge(info.getValue()),
  }),
];
