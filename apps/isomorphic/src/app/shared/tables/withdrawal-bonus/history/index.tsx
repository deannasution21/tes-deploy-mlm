'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import HistoryWDBonusTable from '../../history-wd-bonus';

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
      `/_transactions/history-transaction/${slug ?? session?.user?.id}?type=withdrawal_bonus`,
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
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <HistoryWDBonusTable datanya={dataHistory ?? []} />;
      </div>
    </div>
  );
}
