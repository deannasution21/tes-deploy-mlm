'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { Button, Text } from 'rizzui';
import { generateSlug } from '@core/utils/generate-slug';
import Link from 'next/link';
import { PiGift } from 'react-icons/pi';
import ProjectWriteIcon from '@core/components/icons/project-write';
import { SummaryItem } from '@/types/wd-bonus';

const columnHelper = createColumnHelper<SummaryItem>();

export const WDBonusColumns = [
  {
    id: 'no',
    header: '#',
    size: 60,
    cell: ({ row }: { row: any }) => row.index + 1 + '.',
  },
  columnHelper.accessor('username', {
    id: 'created_at',
    header: 'Username',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap uppercase">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('balance.currency', {
    id: 'balance.currency',
    header: 'Bonus (Sisa Bonus)',
    size: 180,
    cell: (info) => (
      <Text className="whitespace-nowrap">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('username', {
    id: 'withdrawal',
    header: 'Withdrawal',
    size: 180,
    cell: ({ row }: { row: any }) => {
      const username = row?.original?.username;
      const amount = row?.original?.balance?.amount;
      const isDisabled = !amount || amount <= 0;

      if (isDisabled) {
        return (
          <Button size="sm" disabled>
            <PiGift className="mr-2 h-4 w-4" />
            <span>Withdrawal</span>
          </Button>
        );
      }

      return (
        <Link href={`withdrawal-bonus/${generateSlug(username)}/withdrawal`}>
          <Button size="sm">
            <PiGift className="mr-2 h-4 w-4" />
            <span>Withdrawal</span>
          </Button>
        </Link>
      );
    },
  }),
  columnHelper.accessor('username', {
    id: 'history',
    header: 'History',
    size: 180,
    cell: ({ row }: { row: any }) => {
      const username = row?.original?.username;
      const count = row?.original?.withdrawal?.count;
      return (
        <Link
          href={
            count > 0
              ? `withdrawal-bonus/${generateSlug(username)}/history`
              : '#'
          }
        >
          <Button size="sm" variant="flat" disabled={count <= 0}>
            <ProjectWriteIcon className="mr-2 h-4 w-4" />
            <span>History</span>
          </Button>
        </Link>
      );
    },
  }),
];
