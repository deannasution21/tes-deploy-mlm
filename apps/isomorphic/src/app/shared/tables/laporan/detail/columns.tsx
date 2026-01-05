'use client';

import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import { createColumnHelper } from '@tanstack/react-table';
import { Text } from 'rizzui';
import { ActivityItem } from '@/types/report-generate-pin';
import DateCell from '@core/ui/date-cell';
import { PostingActivityItem } from '@/types/report-posting-pin';
import { WithdrawalBonusReportDetail } from '@/types/report-pembayaran-bonus';
import { PembagianBonusReportDetail } from '@/types/report-pembagian-bonus';
import { PaymentReportDetail } from '@/types/report-pembayaran';
import { SniperReportDetail } from '@/types/report-sniper';

const columnHelper = createColumnHelper<ActivityItem>();
const columnHelperPosting = createColumnHelper<PostingActivityItem>();
const columnHelperPembayaran = createColumnHelper<PaymentReportDetail>();
const columnHelperPembayaranBonus =
  createColumnHelper<WithdrawalBonusReportDetail>();
const columnHelperPembagianBonus =
  createColumnHelper<PembagianBonusReportDetail>();
const columnHelperSniperBonus = createColumnHelper<SniperReportDetail>();

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

export const reportPembayaranDetailColumns = [
  {
    id: 'no',
    header: '#',
    size: 60,
    cell: ({ row }: { row: any }) => row.index + 1 + '.',
  },
  columnHelperPembayaran.accessor('date', {
    id: 'date',
    header: 'Tanggal',
    size: 180,
    cell: (info) => <DateCell date={info.getValue()} />,
  }),
  columnHelperPembayaran.accessor('username', {
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
  columnHelperPembayaran.accessor('payment.count', {
    id: 'kuantiti',
    header: 'Jumlah Invoice',
    size: 100,
    cell: (info) => (
      <Text className="whitespace-nowrap uppercase">{info.getValue()}</Text>
    ),
  }),
  columnHelperPembayaran.accessor('payment.amount_currency', {
    id: 'payment',
    header: 'Nominal Pembayaran',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap uppercase">{info.getValue()}</Text>
    ),
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

export const reportPembagianBonusDetailColumns = [
  {
    id: 'no',
    header: '#',
    size: 60,
    cell: ({ row }: { row: any }) => row.index + 1 + '.',
  },
  columnHelperPembagianBonus.accessor('date', {
    id: 'date',
    header: 'Tanggal',
    size: 180,
    cell: (info) => <DateCell date={info.getValue()} />,
  }),
  columnHelperPembagianBonus.accessor('username', {
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
  columnHelperPembagianBonus.accessor('payment.amount_currency', {
    id: 'payment',
    header: 'Nominal Bonus',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap uppercase">{info.getValue()}</Text>
    ),
  }),
];

export const reportSniperDetailColumns = [
  {
    id: 'no',
    header: '#',
    size: 60,
    cell: ({ row }: { row: any }) => row.index + 1 + '.',
  },
  columnHelperSniperBonus.accessor('date', {
    id: 'date',
    header: 'Tanggal',
    size: 180,
    cell: (info) => <DateCell date={info.getValue()} />,
  }),
  columnHelperSniperBonus.accessor('full_name', {
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
  columnHelperSniperBonus.accessor('type_counts', {
    id: 'kuantiti',
    header: 'Jumlah Invoice',
    size: 100,
    cell: (info) => {
      const value = info.getValue() as Record<string, number>;

      return (
        <div className="space-y-1">
          {Object.entries(value).map(([key, val]) => (
            <Text key={key} className="whitespace-nowrap uppercase">
              {key.replace('_', ' ')}: {val}
            </Text>
          ))}
        </div>
      );
    },
  }),
  columnHelperSniperBonus.accessor('count', {
    id: 'total',
    header: 'Total Invoice',
    size: 100,
    cell: (info) => (
      <Text className="whitespace-nowrap uppercase">{info.getValue()}</Text>
    ),
  }),
];
