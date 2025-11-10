'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  BankData,
  BankStatusResponse,
  TransactionData,
  TransactionResponse,
} from '@/types';
import { Alert, Text } from 'rizzui';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { getBankNameByCode } from '@/utils/helper';
import WDBonusTable from '../wd-bonus';

export default function WithdrawalBonusTable({
  className,
}: {
  className?: string;
}) {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);

  const [dataUser, setDataUser] = useState<TransactionData | null>(null);
  const [dataBank, setDataBank] = useState<BankData[]>([]);

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    Promise.all([
      fetchWithAuth<TransactionResponse>(
        `/_transactions/withdrawal-summary?type=plan_a&category=bonus`,
        { method: 'GET' },
        session.accessToken
      ),
      fetchWithAuth<BankStatusResponse>(
        `/_services/list-bank`,
        { method: 'GET' },
        session.accessToken
      ),
    ])
      .then(([withdrawalData, bankData]) => {
        setDataUser(withdrawalData?.data || null);
        setDataBank(bankData?.data || []);
      })
      .catch((error) => {
        console.error(error);
        setDataUser(null);
        setDataBank([]);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  if (isLoading)
    return <p className="py-20 text-center">Sedang memuat data...</p>;

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <div className="rounded-lg border border-gray-300 p-5 @3xl:p-7">
          <ul className="grid gap-3">
            <li className="flex items-center gap-1">
              <span className="min-w-28 font-semibold text-gray-900">
                User ID
              </span>
              <span className="font-semibold text-gray-900">:</span>
              <span>{dataUser?.detail_users?.username}</span>
            </li>
            <li className="flex items-center gap-1">
              <span className="min-w-28 font-semibold text-gray-900">Nama</span>
              <span className="font-semibold text-gray-900">:</span>
              <span>{dataUser?.detail_users?.name}</span>
            </li>
            <li className="flex items-center gap-1">
              <span className="min-w-28 font-semibold text-gray-900">Bank</span>
              <span className="font-semibold text-gray-900">:</span>
              <span className="uppercase">
                {dataUser?.detail_users?.bank_account?.bank_name
                  ? getBankNameByCode(
                      dataBank,
                      dataUser?.detail_users?.bank_account?.bank_name
                    )
                  : '-'}
              </span>
            </li>
            <li className="flex items-center gap-1">
              <span className="min-w-28 font-semibold text-gray-900">
                No. Rekening
              </span>
              <span className="font-semibold text-gray-900">:</span>
              <span>
                {dataUser?.detail_users?.bank_account?.account_number}
              </span>
            </li>
            <li className="flex items-center gap-1">
              <span className="min-w-28 font-semibold text-gray-900">
                Atas Nama
              </span>
              <span className="font-semibold text-gray-900">:</span>
              <span>{dataUser?.detail_users?.bank_account?.account_name}</span>
            </li>
          </ul>
          <Alert variant="flat" color="success" className="mt-5">
            <Text className="font-semibold">Informasi</Text>
            <Text className="break-normal">
              Anda memiliki total <strong>{dataUser?.count ?? 0} ID</strong>{' '}
              dengan rekening yang sama
            </Text>
          </Alert>
        </div>
        <WDBonusTable datanya={dataUser?.summary ?? []} />
      </div>
    </div>
  );
}
