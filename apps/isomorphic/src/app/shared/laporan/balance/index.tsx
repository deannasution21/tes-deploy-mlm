'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { BalanceReport, BalanceResponseData } from '@/types/report-balance';
import cn from '@core/utils/class-names';
import { PiBank, PiWallet } from 'react-icons/pi';

export default function ReportBalancePage({
  className,
}: {
  className?: string;
}) {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);

  const [dataAnalytics, setDataAnalytics] =
    useState<BalanceResponseData | null>(null);
  const [type, setType] = useState<string>('daily');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [custom, setCustom] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<BalanceReport>(
      `/_admin-owners/balance/fetch`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        const dataAnalytics = data?.data || null;
        setDataAnalytics(dataAnalytics);
      })
      .catch((error) => {
        console.error(error);
        setDataAnalytics(null);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken, type, custom, startDate]);

  function handleFilterChange(typenya: string) {
    setType(typenya);
  }

  if (isLoading)
    return <p className="py-20 text-center">Sedang memuat data...</p>;

  return (
    <>
      <div className="@container">
        <div className="grid grid-cols-1 gap-6 3xl:gap-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 2xl:gap-6 3xl:gap-8">
            <div
              className={cn(
                `group w-full rounded-[14px] border border-gray-300 px-6 py-7 @container first:bg-primary`,
                className
              )}
            >
              <div className="flex items-center gap-5">
                <span
                  className={cn(
                    `flex rounded-[14px] bg-primary p-2.5 text-gray-0 group-first:bg-gray-0 group-first:text-primary dark:text-gray-900 dark:group-first:bg-gray-900`
                  )}
                >
                  <PiBank className="h-auto w-[30px]" />
                </span>
                <div className="space-y-1.5">
                  <p className="font-medium capitalize text-gray-500 group-first:text-gray-100 dark:group-first:text-gray-800">
                    {dataAnalytics?.bank_account?.bank_name}
                  </p>
                  <p className="text-lg font-bold text-gray-900 group-first:text-gray-0 dark:text-gray-700 dark:group-first:text-gray-900 2xl:text-[20px] 3xl:text-3xl">
                    {dataAnalytics?.bank_account?.account_number}
                  </p>
                  <p className="font-medium capitalize text-gray-500 group-first:text-gray-100 dark:group-first:text-gray-800">
                    ({dataAnalytics?.bank_account?.account_name})
                  </p>
                </div>
              </div>
            </div>
            <div
              className={cn(
                `group w-full rounded-[14px] border border-gray-300 px-6 py-7 @container first:bg-primary`,
                className
              )}
            >
              <div className="flex items-center gap-5">
                <span
                  className={cn(
                    `flex rounded-[14px] bg-primary p-2.5 text-gray-0 group-first:bg-gray-0 group-first:text-primary dark:text-gray-900 dark:group-first:bg-gray-900`
                  )}
                >
                  <PiWallet className="h-auto w-[30px]" />
                </span>
                <div className="space-y-1.5">
                  <p className="font-medium capitalize text-gray-500 group-first:text-gray-100 dark:group-first:text-gray-800">
                    Total Saldo
                  </p>
                  <p className="text-lg font-bold text-gray-900 group-first:text-gray-0 dark:text-gray-700 dark:group-first:text-gray-900 2xl:text-[20px] 3xl:text-3xl">
                    {dataAnalytics?.raw_balance?.formatted}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={cn(
                `group w-full rounded-[14px] border border-gray-300 px-6 py-7 @container first:bg-primary`,
                className
              )}
            >
              <div className="flex items-center gap-5">
                <span
                  className={cn(
                    `flex rounded-[14px] bg-primary p-2.5 text-gray-0 group-first:bg-gray-0 group-first:text-primary dark:text-gray-900 dark:group-first:bg-gray-900`
                  )}
                >
                  <PiWallet className="h-auto w-[30px]" />
                </span>
                <div className="space-y-1.5">
                  <p className="font-medium capitalize text-gray-500 group-first:text-gray-100 dark:group-first:text-gray-800">
                    Saldo Mengendap
                  </p>
                  <p className="text-lg font-bold text-gray-900 group-first:text-gray-0 dark:text-gray-700 dark:group-first:text-gray-900 2xl:text-[20px] 3xl:text-3xl">
                    {dataAnalytics?.deposit_balance?.formatted}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={cn(
                `group w-full rounded-[14px] border border-gray-300 px-6 py-7 @container first:bg-primary`,
                className
              )}
            >
              <div className="flex items-center gap-5">
                <span
                  className={cn(
                    `flex rounded-[14px] bg-primary p-2.5 text-gray-0 group-first:bg-gray-0 group-first:text-primary dark:text-gray-900 dark:group-first:bg-gray-900`
                  )}
                >
                  <PiWallet className="h-auto w-[30px]" />
                </span>
                <div className="space-y-1.5">
                  <p className="font-medium capitalize text-gray-500 group-first:text-gray-100 dark:group-first:text-gray-800">
                    Saldo Tersedia
                  </p>
                  <p className="text-lg font-bold text-gray-900 group-first:text-gray-0 dark:text-gray-700 dark:group-first:text-gray-900 2xl:text-[20px] 3xl:text-3xl">
                    {dataAnalytics?.available_balance?.formatted}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
