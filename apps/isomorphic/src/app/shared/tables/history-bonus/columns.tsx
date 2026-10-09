'use client';

import DateCell from '@core/ui/date-cell';
import { createColumnHelper } from '@tanstack/react-table';
import { Badge, Text } from 'rizzui';
import { BonusAttribute, BonusItem } from '@/types';
import {
  getPlanLabel,
  LOCK_STATUS_COLOR,
  LOCK_STATUS_LABEL,
} from '@/config/plans';

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

function lockNote({ lock_status, expires_at, no_expiry }: BonusAttribute) {
  if (lock_status === 'LOCKED') {
    if (no_expiry) return 'Cair setelah upgrade ke Business';
    if (expires_at)
      return `Hangus ${formatDate(expires_at)} jika belum upgrade`;
    return 'Cair setelah upgrade';
  }
  if (lock_status === 'EXPIRED') return 'Tidak dapat dicairkan';
  return null;
}

function CommissionStatus({ attribute }: { attribute: BonusAttribute }) {
  const status = attribute.lock_status;
  if (!status) return <Text>-</Text>;
  const note = lockNote(attribute);

  return (
    <div className="flex flex-col items-start gap-1">
      <Badge variant="flat" color={LOCK_STATUS_COLOR[status]} size="sm">
        {LOCK_STATUS_LABEL[status] ?? status}
      </Badge>
      {note && <Text className="text-xs text-gray-500">{note}</Text>}
    </div>
  );
}

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
    cell: (info) => <DateCell date={info.getValue()} />,
  }),
  columnHelper.accessor('attribute.from', {
    id: 'from',
    header: 'Dari',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap uppercase">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('attribute.plan', {
    id: 'plan',
    header: 'Paket',
    size: 120,
    cell: (info) => (
      <Text className="whitespace-nowrap">{getPlanLabel(info.getValue())}</Text>
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
  columnHelper.accessor('attribute.lock_status', {
    id: 'lock_status',
    header: 'Status',
    size: 200,
    cell: (info) => (
      <CommissionStatus attribute={info.row.original.attribute} />
    ),
  }),
];
