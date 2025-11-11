'use client';

import DateCell from '@core/ui/date-cell';
import { createColumnHelper } from '@tanstack/react-table';
import { Text } from 'rizzui';
import { Transaction } from '../../withdrawal-gaji/history';
import { getStatusBadge } from '@core/components/table-utils/get-status-badge';

const columnHelper = createColumnHelper<Transaction>();

export const historyWDGajiColumns = [
  {
    id: 'no',
    header: '#',
    size: 60,
    cell: ({ row }: { row: any }) => row.index + 1 + '.',
  },
  columnHelper.accessor('attributes.created_at', {
    id: 'created_at',
    header: 'Tanggal',
    size: 180,
    cell: (info) => <DateCell date={new Date(info.getValue())} />,
  }),
  columnHelper.accessor('attributes.withdrawal.total_currency', {
    id: 'total_currency',
    header: 'Jumlah',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('attributes.withdrawal.total_currency', {
    id: 'total_currency',
    header: 'Biaya Bank',
    size: 180,
    cell: (info) => <Text className="whitespace-nowrap">Rp 0</Text>,
  }),
  columnHelper.accessor('attributes.withdrawal.total_currency', {
    id: 'total_currency',
    header: 'Total Transfer',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('attributes.status.code', {
    id: 'attributes.status',
    size: 100,
    header: 'Status',
    cell: (info) => getStatusBadge(info.getValue().toString()),
  }),
];
