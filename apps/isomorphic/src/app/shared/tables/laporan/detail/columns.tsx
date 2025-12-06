'use client';

import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import { createColumnHelper } from '@tanstack/react-table';
import { Text } from 'rizzui';
import { ActivityItem } from '@/types/report-generate-pin';
import DateCell from '@core/ui/date-cell';
import { PostingActivityItem } from '@/types/report-posting-pin';
import { WithdrawalBonusReportDetail } from '@/types/report-pembayaran-bonus';

const columnHelper = createColumnHelper<ActivityItem>();
const columnHelperPosting = createColumnHelper<PostingActivityItem>();
const columnHelperPembayaranBonus =
  createColumnHelper<WithdrawalBonusReportDetail>();

export const reportGeneratePinDetailColumns = [
  {
    id: 'no',
    header: '#',
    size: 60,
    cell: ({ row }: { row: any }) => row.index + 1 + '.',
  },
  columnHelper.accessor('date', {
    id: 'date',
    header: 'Tanggal',
    size: 180,
    cell: (info) => <DateCell date={info.getValue()} />,
  }),
  columnHelper.accessor('username', {
    id: 'username',
    header: 'Username',
    size: 150,
    cell: (info) => (
      <>
        <Text className="font-medium uppercase text-gray-700">
          {info.getValue()}
        </Text>
      </>
    ),
  }),
  columnHelper.accessor('from', {
    id: 'from',
    header: 'Pengirim',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap uppercase">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('to', {
    id: 'to',
    header: 'Penerima',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap uppercase">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('total_pin', {
    id: 'total_pin',
    header: 'Total PIN',
    size: 100,
    cell: (info) => (
      <Text className="whitespace-nowrap">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('details', {
    id: 'details',
    header: 'Detail',
    size: 150,
    cell: (info) => (
      <Text className="truncate !text-sm">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('action', {
    id: 'action',
    size: 100,
    header: 'Jenis',
    cell: (info) => (
      <Text className="whitespace-nowrap font-medium uppercase text-primary">
        {info.getValue()}
      </Text>
    ),
  }),
  columnHelper.accessor('action_status', {
    id: 'status',
    size: 100,
    header: 'Status',
    cell: (info) => getStatusBadge(info.getValue()),
  }),
];

export const reportPostingPinDetailColumns = [
  {
    id: 'no',
    header: '#',
    size: 60,
    cell: ({ row }: { row: any }) => row.index + 1 + '.',
  },
  columnHelperPosting.accessor('date', {
    id: 'date',
    header: 'Tanggal',
    size: 180,
    cell: (info) => <DateCell date={info.getValue()} />,
  }),
  columnHelperPosting.accessor('username', {
    id: 'username',
    header: 'Parent',
    size: 150,
    cell: (info) => (
      <>
        <Text className="font-medium uppercase text-gray-700">
          {info.getValue()}
        </Text>
      </>
    ),
  }),
  columnHelperPosting.accessor('mlm_user_id', {
    id: 'mlm_user_id',
    header: 'Username',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap uppercase">{info.getValue()}</Text>
    ),
  }),
  columnHelperPosting.accessor('position', {
    id: 'position',
    header: 'Posisi',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap uppercase">
        {info.getValue() === 'left' ? 'Kiri' : 'Kanan'}
      </Text>
    ),
  }),
  columnHelperPosting.accessor('details', {
    id: 'details',
    header: 'Detail',
    size: 150,
    cell: (info) => (
      <Text className="truncate !text-sm">{info.getValue()}</Text>
    ),
  }),
  columnHelperPosting.accessor('action', {
    id: 'action',
    size: 100,
    header: 'Jenis',
    cell: (info) => (
      <Text className="whitespace-nowrap font-medium uppercase text-primary">
        {info.getValue()}
      </Text>
    ),
  }),
  columnHelperPosting.accessor('action_status', {
    id: 'status',
    size: 100,
    header: 'Status',
    cell: (info) => getStatusBadge(info.getValue()),
  }),
];

export const reportPembayaranBonusDetailColumns = [
  {
    id: 'no',
    header: '#',
    size: 60,
    cell: ({ row }: { row: any }) => row.index + 1 + '.',
  },
  columnHelperPembayaranBonus.accessor('date', {
    id: 'date',
    header: 'Tanggal',
    size: 180,
    cell: (info) => <DateCell date={info.getValue()} />,
  }),
  columnHelperPembayaranBonus.accessor('username', {
    id: 'username',
    header: 'Username',
    size: 150,
    cell: (info) => (
      <>
        <Text className="font-medium uppercase text-gray-700">
          {info.getValue()}
        </Text>
      </>
    ),
  }),
  columnHelperPembayaranBonus.accessor('withdrawal.amount_currency', {
    id: 'withdrawal',
    header: 'Nominal WD',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap uppercase">{info.getValue()}</Text>
    ),
  }),
];
