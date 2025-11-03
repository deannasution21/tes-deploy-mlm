'use client';

import cn from '@core/utils/class-names';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  AmountCurrency,
  BankData,
  BankStatusResponse,
  TransactionData,
  TransactionResponse,
} from '@/types';
import BasicTableWidget from '@core/components/controlled-table/basic-table-widget';
import { Alert, Button, Text, Title } from 'rizzui';
import Link from 'next/link';
import ProjectWriteIcon from '@core/components/icons/project-write';
import { PiGift } from 'react-icons/pi';
import { generateSlug } from '@core/utils/generate-slug';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { getBankNameByCode } from '@/utils/helper';

export const getColumns = () => [
  {
    title: <span className="ml-6 block">No</span>,
    dataIndex: 'index',
    key: 'index',
    width: 50,
    render: (_: any, __: any, index: number) => (
      <Text className="ml-6 text-gray-700">{index + 1}.</Text>
    ),
  },
  {
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
    width: 150,
    render: (username: string) => (
      <Text className="font-medium text-gray-700">{username}</Text>
    ),
  },
  {
    title: 'Bonus (Sisa Bonus)',
    dataIndex: 'balance',
    key: 'balance',
    width: 150,
    render: ({ currency }: { currency: string }) => (
      <Text className="text-gray-700">{currency}</Text>
    ),
  },
  {
    title: 'Withdrawal',
    dataIndex: 'username',
    key: 'username',
    width: 150,
    render: (username: string, row: any) => (
      <Link href={`withdrawal-bonus/${generateSlug(username)}/withdrawal`}>
        <Button size="sm" disabled={row.balance.amount === 0}>
          <PiGift className="mr-2 h-4 w-4" />
          <span>Withdrawal</span>
        </Button>
      </Link>
    ),
  },
  {
    title: 'History',
    dataIndex: 'username',
    key: 'username',
    width: 150,
    render: (username: string) => (
      <Link href={`withdrawal-bonus/${generateSlug(username)}/history`}>
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
  const [isLoading, setLoading] = useState(true);

  const [dataUser, setDataUser] = useState<TransactionData | null>(null);
  const [dataBank, setDataBank] = useState<BankData[]>([]);

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    Promise.all([
      fetchWithAuth<TransactionResponse>(
        `/_transactions/withdrawal-summary?type=plan_a`,
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
    <>
      <div className="mb-6 grid gap-6 @2xl:grid-cols-2 @3xl:mb-10 @3xl:gap-10">
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
                {dataUser?.detail_users?.bank_name
                  ? getBankNameByCode(
                      dataBank,
                      dataUser?.detail_users?.bank_name
                    )
                  : '-'}
              </span>
            </li>
            <li className="flex items-center gap-1">
              <span className="min-w-28 font-semibold text-gray-900">
                No. Rekening
              </span>
              <span className="font-semibold text-gray-900">:</span>
              <span>{dataUser?.detail_users?.account_number}</span>
            </li>
            <li className="flex items-center gap-1">
              <span className="min-w-28 font-semibold text-gray-900">
                Atas Nama
              </span>
              <span className="font-semibold text-gray-900">:</span>
              <span>{dataUser?.detail_users?.account_name}</span>
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
      </div>

      <BasicTableWidget
        title="Daftar Akumulasi Bonus"
        description="Dari ID dengan rekening yang sama"
        className={cn(
          'pb-0 lg:pb-0 [&_.rc-table-row:last-child_td]:border-b-0'
        )}
        data={dataUser?.summary ?? []}
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
