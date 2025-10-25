'use client';

import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import DateCell from '@core/ui/date-cell';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox, Text } from 'rizzui';
import { HistoryTransferPinItem } from '@/types';

const statusColorClassName = {
  Complete: 'text-green-dark before:bg-green-dark',
  Pending: 'before:bg-orange text-orange-dark',
  Canceled: 'text-red-dark before:bg-red-dark',
};

const columnHelper = createColumnHelper<HistoryTransferPinItem>();

export const transactionHistoryColumns = [
  columnHelper.accessor('attributes.created_at', {
    id: 'created_at',
    header: 'Tanggal',
    size: 180,
    cell: (info) => <DateCell date={new Date(info.getValue())} />,
  }),
  columnHelper.accessor('attributes.from', {
    id: 'from',
    header: 'Pengirim',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('attributes.to', {
    id: 'to',
    header: 'Penerima',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('attributes.total_pin', {
    id: 'total_pin',
    header: 'Total PIN',
    size: 100,
    cell: (info) => (
      <Text className="whitespace-nowrap">{info.getValue()}</Text>
    ),
  }),
  columnHelper.display({
    id: 'pin_code',
    size: 250,
    header: 'PIN',
    cell: ({ row }) => (
      <Text className="truncate !text-sm">{row.original.pin_code}</Text>
    ),
  }),
  columnHelper.accessor('attributes.status', {
    id: 'attributes.status',
    size: 100,
    header: 'Status',
    cell: (info) => getStatusBadge(info.getValue()),
  }),
];
