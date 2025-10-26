'use client';

import cn from '@core/utils/class-names';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { HistoryTransferPinItem, HistoryTransferPinResponse } from '@/types';
import BasicTableWidget from '@core/components/controlled-table/basic-table-widget';
import { Button, Text, Title } from 'rizzui';
import Link from 'next/link';
import ProjectWriteIcon from '@core/components/icons/project-write';
import { PiGift } from 'react-icons/pi';
import { generateSlug } from '@core/utils/generate-slug';

export const getColumns = () => [
  {
    title: <span className="ml-6 block">Username</span>,
    dataIndex: 'attributes',
    key: 'attributes',
    width: 150,
    render: ({ from }: { from: string }) => (
      <Text className="ml-6 font-medium text-gray-700">{from}</Text>
    ),
  },
  {
    title: 'Bonus',
    dataIndex: 'pin_code',
    key: 'pin_code',
    width: 150,
    render: (pin_code: string) => (
      <Text className="text-gray-700">Rp 500.000</Text>
    ),
  },
  {
    title: 'Withdrawal',
    dataIndex: 'pin_code',
    key: 'pin_code',
    width: 150,
    render: (pin_code: string) => (
      <Link href={`withdrawal-bonus/${generateSlug(pin_code)}/withdrawal`}>
        <Button size="sm">
          <PiGift className="mr-2 h-4 w-4" />
          <span>Withdrawal</span>
        </Button>
      </Link>
    ),
  },
  {
    title: 'History',
    dataIndex: 'pin_code',
    key: 'pin_code',
    width: 150,
    render: (pin_code: string) => (
      <Link href={`withdrawal-bonus/${generateSlug(pin_code)}/history`}>
        <Button size="sm" variant="flat">
          <ProjectWriteIcon className="mr-2 h-4 w-4" />
          <span>History</span>
        </Button>
      </Link>
    ),
  },
];

export default function WithdrawalBonusTable({
  className,
}: {
  className?: string;
}) {
  const { data: session } = useSession();
  const [dataHistory, setDataHistory] = useState<HistoryTransferPinItem[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const getDataHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/_pins/history-pin/${session?.user?.id}?type=received`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-app-token': session?.accessToken ?? '',
            },
          }
        );

        if (!res.ok) throw new Error(`HTTP error! ${res.status}`);

        const data = (await res.json()) as HistoryTransferPinResponse;
        setDataHistory(data?.data?.histories);
      } catch (error) {
        console.error('Fetch data error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) getDataHistory();
  }, [session?.accessToken]);

  if (isLoading)
    return <p className="my-5 text-center">Sedang memuat data...</p>;

  return (
    <>
      <div className="mb-6 grid gap-6 @2xl:grid-cols-2 @3xl:mb-10 @3xl:gap-10">
        <div className="rounded-lg border border-gray-300 p-5 @3xl:p-7">
          <Title as="h3" className="text-base font-semibold sm:text-lg"></Title>
          <ul className="mt-4 grid gap-3 @3xl:mt-5">
            <li className="flex items-center gap-1">
              <span className="min-w-28 font-semibold text-gray-900">Nama</span>
              <span className="font-semibold text-gray-900">:</span>
              <span>{session?.user?.name}</span>
            </li>
            <li className="flex items-center gap-1">
              <span className="min-w-28 font-semibold text-gray-900">Bank</span>
              <span className="font-semibold text-gray-900">:</span>
              <span>{session?.user?.bankName}</span>
            </li>
            <li className="flex items-center gap-1">
              <span className="min-w-28 font-semibold text-gray-900">
                No. Rekening
              </span>
              <span className="font-semibold text-gray-900">:</span>
              <span>{session?.user?.bankAccount}</span>
            </li>
            <li className="flex items-center gap-1">
              <span className="min-w-28 font-semibold text-gray-900">
                Atas Nama
              </span>
              <span className="font-semibold text-gray-900">:</span>
              <span>{session?.user?.bankName}</span>
            </li>
          </ul>
        </div>
      </div>
      <BasicTableWidget
        title="Withdrawal Bonus"
        className={cn(
          'pb-0 lg:pb-0 [&_.rc-table-row:last-child_td]:border-b-0'
        )}
        data={dataHistory}
        getColumns={getColumns}
        noGutter
        enableSearch={false}
        scroll={{
          x: 900,
        }}
      />
    </>
  );
}
