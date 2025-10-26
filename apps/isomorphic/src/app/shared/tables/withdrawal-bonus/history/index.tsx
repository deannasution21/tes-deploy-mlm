'use client';

import cn from '@core/utils/class-names';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { HistoryTransferPinItem, HistoryTransferPinResponse } from '@/types';
import BasicTableWidget from '@core/components/controlled-table/basic-table-widget';
import { Badge, Button, Text, Title } from 'rizzui';

export const getColumns = () => [
  {
    title: <span className="ml-6 block">Tanggal</span>,
    dataIndex: 'attributes',
    key: 'attributes',
    width: 150,
    render: ({ created_at }: { created_at: string }) => (
      <Text className="ml-6 font-medium text-gray-700">{created_at}</Text>
    ),
  },
  {
    title: <p className="text-end">Jumlah</p>,
    dataIndex: 'pin_code',
    key: 'pin_code',
    width: 150,
    render: (pin_code: string) => (
      <Text className="text-end text-gray-700">Rp 500.000</Text>
    ),
  },
  {
    title: <p className="text-end">Biaya Bank</p>,
    dataIndex: 'pin_code',
    key: 'pin_code',
    width: 150,
    render: (pin_code: string) => (
      <Text className="text-end text-gray-700">Rp 3.500</Text>
    ),
  },
  {
    title: <p className="text-end">Total Transfer</p>,
    dataIndex: 'pin_code',
    key: 'pin_code',
    width: 150,
    render: (pin_code: string) => (
      <Text className="text-end text-gray-700">Rp 503.500</Text>
    ),
  },
  {
    title: <p className="text-end">Status</p>,
    dataIndex: 'attributes',
    key: 'attributes',
    width: 150,
    render: ({ status }: { status: string }) => (
      <div className="flex items-center justify-end gap-1.5">
        <Badge
          renderAsDot
          color={status === 'SUCCESS' ? 'success' : 'secondary'}
        />
        {status}
      </div>
    ),
  },
];

export default function HistoryWithdrawalBonusTable({
  className,
  slug,
}: {
  className?: string;
  slug?: any;
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
    <BasicTableWidget
      title="History Withdrawal Bonus"
      className={cn('pb-0 lg:pb-0 [&_.rc-table-row:last-child_td]:border-b-0')}
      data={dataHistory}
      getColumns={getColumns}
      noGutter
      enableSearch={false}
      scroll={{
        x: 900,
      }}
    />
  );
}
