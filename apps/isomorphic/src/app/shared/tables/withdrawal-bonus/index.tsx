'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { BankData, BankStatusResponse } from '@/types';
import { Alert, Button, Select, Text } from 'rizzui';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { getBankNameByCode } from '@/utils/helper';
import { routes } from '@/config/routes';
import WDBonusTable from '../wd-bonus';
import { SummaryData, SummaryResponse } from '@/types/wd-bonus';

const tipePlan = [
  {
    value: 'free',
    label: 'Pasif',
  },
  {
    value: 'plan_a',
    label: 'Reguler',
  },
];

export default function WithdrawalBonusTable({
  className,
}: {
  className?: string;
}) {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);

  const [dataUser, setDataUser] = useState<SummaryData | null>(null);
  const [dataBank, setDataBank] = useState<BankData[]>([]);
  const [selectedPlan, setSelectedPlan] = useState('plan_a');

  // Bank list cukup diambil sekali, tidak tergantung plan
  useEffect(() => {
    if (!session?.accessToken) return;

    fetchWithAuth<BankStatusResponse>(
      `/_services/list-bank`,
      { method: 'GET' },
      session.accessToken
    )
      .then((bankData) => {
        setDataBank(bankData?.data || []);
      })
      .catch((error) => {
        console.error(error);
        setDataBank([]);
      });
  }, [session?.accessToken]);

  // Ringkasan bonus berbeda per plan (Pasif / Reguler), jadi refetch tiap plan berubah
  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<SummaryResponse>(
      `/_transactions/withdrawal-summary?type=${selectedPlan}&category=bonus`,
      { method: 'GET' },
      session.accessToken
    )
      .then((withdrawalData) => {
        setDataUser(withdrawalData?.data || null);
      })
      .catch((error) => {
        console.error(error);
        setDataUser(null);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken, selectedPlan]);

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <div className="w-full max-w-[220px]">
          <Select
            label="Plan"
            size="lg"
            labelClassName="text-sm font-semibold text-gray-900"
            selectClassName="border-2 border-primary bg-primary-lighter/40 font-semibold text-primary-dark shadow-sm"
            dropdownClassName="!z-10 h-fit"
            inPortal={false}
            placeholder="Pilih Plan"
            options={tipePlan}
            onChange={(val) => setSelectedPlan(val as string)}
            value={selectedPlan}
            getOptionValue={(option) => option.value}
            displayValue={(selected) =>
              tipePlan.find((p) => p.value === selected)?.label ?? ''
            }
          />
        </div>

        {isLoading ? (
          <p className="py-20 text-center">Sedang memuat data...</p>
        ) : selectedPlan === 'free' &&
          dataUser?.detail_users?.can_withdrawal_bonus?.member_pasif === true ? (
          <Alert variant="flat" color="danger">
            <Text className="font-semibold">
              Anda Belum Aktivasi sebagai Member Pasif
            </Text>
            <Text className="mt-1 break-normal">
              {dataUser?.detail_users?.can_withdrawal_bonus?.message ??
                'Data bonus tidak dapat ditampilkan karena status Anda masih Member Pasif dan belum diaktivasi.'}
            </Text>
            <Link href={routes.promo.pasif.index}>
              <Button size="sm" className="mt-3">
                Aktivasi Sekarang
              </Button>
            </Link>
          </Alert>
        ) : (
          <>
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
                  <span className="min-w-28 font-semibold text-gray-900">
                    Nama
                  </span>
                  <span className="font-semibold text-gray-900">:</span>
                  <span>{dataUser?.detail_users?.name}</span>
                </li>
                <li className="flex items-center gap-1">
                  <span className="min-w-28 font-semibold text-gray-900">
                    Bank
                  </span>
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
                  <span>
                    {dataUser?.detail_users?.bank_account?.account_name}
                  </span>
                </li>
              </ul>
              <Alert variant="flat" color="success" className="mt-5">
                <Text className="font-semibold">Informasi</Text>
                <ol className="list-disc ps-5">
                  <li>
                    <Text className="break-normal">
                      Anda memiliki total{' '}
                      <strong>{dataUser?.count ?? 0} ID</strong> dengan
                      rekening yang sama
                    </Text>
                  </li>
                  <li>
                    <Text className="break-normal">
                      Anda memiliki total akumulasi{' '}
                      <strong>{dataUser?.balance?.currency}</strong> bonus
                    </Text>
                  </li>
                </ol>
              </Alert>
            </div>
            <WDBonusTable datanya={dataUser?.summary ?? []} plan={selectedPlan} />
          </>
        )}
      </div>
    </div>
  );
}
