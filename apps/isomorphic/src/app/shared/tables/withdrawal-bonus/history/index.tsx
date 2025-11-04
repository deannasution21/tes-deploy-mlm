'use client';

import cn from '@core/utils/class-names';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { HistoryTransferPinItem, HistoryTransferPinResponse } from '@/types';
import BasicTableWidget from '@core/components/controlled-table/basic-table-widget';
import { Badge, Button, Text, Title } from 'rizzui';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

export interface TransactionsResponse {
  code: number;
  success: boolean;
  message: string;
  data: TransactionsData;
}

export interface TransactionsData {
  count: number;
  transactions: Transaction[];
}

export interface Transaction {
  ref_id: string;
  attributes: TransactionAttributes;
}

export interface TransactionAttributes {
  created_at: string; // e.g., "2025-10-30 22:28"
  status: TransactionStatus;
  transfer_at: string;
  withdrawal: Withdrawal;
}

export interface TransactionStatus {
  code: number;
  message: string;
}

export interface Withdrawal {
  username: string;
  receipt: string;
  total_amount: number;
  total_currency: string; // formatted currency string like "Rp 14.000,00"
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  plan: string;
  status: TransactionStatus;
}

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
    dataIndex: 'attributes',
    key: 'attributes',
    width: 150,
    render: ({ withdrawal }: { withdrawal: Withdrawal }) => (
      <Text className="text-end text-gray-700">
        {withdrawal.total_currency}
      </Text>
    ),
  },
  {
    title: <p className="text-end">Biaya Bank</p>,
    dataIndex: 'attributes',
    key: 'attributes',
    width: 150,
    render: ({ withdrawal }: { withdrawal: Withdrawal }) => (
      <Text className="text-end text-gray-700">Rp 0</Text>
    ),
  },
  {
    title: <p className="text-end">Total Transfer</p>,
    dataIndex: 'attributes',
    key: 'attributes',
    width: 150,
    render: ({ withdrawal }: { withdrawal: Withdrawal }) => (
      <Text className="text-end text-gray-700">
        {withdrawal.total_currency}
      </Text>
    ),
  },
  {
    title: <p className="text-end">Status</p>,
    dataIndex: 'attributes',
    key: 'attributes',
    width: 150,
    render: ({ status }: { status: TransactionStatus }) => (
      <div className="flex items-center justify-end gap-1.5">
        <Badge
          renderAsDot
          color={status.code === 1 ? 'success' : 'secondary'}
        />
        {status.message}
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
  const [dataHistory, setDataHistory] = useState<Transaction[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<TransactionsResponse>(
      `/_transactions/history-transaction/${slug ?? session?.user?.id}?type=withdrawal`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setDataHistory(data.data.transactions || []);
      })
      .catch((error) => {
        console.error(error);
        // Clear the data so UI can show "no data"
        setDataHistory([]);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken, slug]);

  if (isLoading)
    return <p className="py-20 text-center">Sedang memuat data...</p>;

  return (
    <BasicTableWidget
      title="History Withdrawal Bonus"
      className={cn('pb-0 lg:pb-0 [&_.rc-table-row:last-child_td]:border-b-0')}
      data={dataHistory}
      getColumns={getColumns}
      noGutter
      enableSearch={false}
      scroll={{
        x: 750,
      }}
    />
  );
}
