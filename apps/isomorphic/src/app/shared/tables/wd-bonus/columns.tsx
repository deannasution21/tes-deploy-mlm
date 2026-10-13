'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { Button, Text } from 'rizzui';
import { generateSlug } from '@core/utils/generate-slug';
import Link from 'next/link';
import { PiGift, PiLockBold } from 'react-icons/pi';
import { routes } from '@/config/routes';
import ProjectWriteIcon from '@core/components/icons/project-write';
import { SummaryItem } from '@/types/wd-bonus';

const columnHelper = createColumnHelper<SummaryItem>();

// canWithdraw=false (member paket Pendaftaran): saldo tetap tampil,
// tombol diarahkan ke Upgrade Paket
export const getWDBonusColumns = (plan: string, canWithdraw = true) => [
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

      if (!canWithdraw && !isDisabled) {
        return (
          <Link prefetch={false} href={routes.upgradePaket.index}>
            <Button
              size="sm"
              className="gap-1.5 whitespace-nowrap border-0 bg-gradient-to-r from-[#c69731] via-[#e0b84a] to-[#AA8453] font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:brightness-105"
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white/25">
                <PiLockBold className="h-3 w-3" />
              </span>
              <span>Upgrade untuk Cairkan</span>
            </Button>
          </Link>
        );
      }

      if (isDisabled) {
        return (
          <Button size="sm" disabled>
            <PiGift className="mr-2 h-4 w-4" />
            <span>Withdrawal</span>
          </Button>
        );
      }

      return (
        <Link
          prefetch={false}
          href={`withdrawal-bonus/${generateSlug(username)}/withdrawal?plan=${plan}`}
        >
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
          prefetch={false}
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
