'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { StatCardTotal } from '../status';
import { formatToYMD, formatToYearMonth } from '@/utils/helper';
import ReportFilter from '../filter';

interface ReportResponse {
  code: number;
  success: boolean;
  message: string;
  data: {
    used: Record<string, number>;
    active: Record<string, number>;
  };
}

export default function ReportTotalPinPage({
  className,
}: {
  className?: string;
}) {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);

  const [dataAnalytics, setDataAnalytics] = useState<{
    used: Record<string, number>;
    active: Record<string, number>;
  }>({
    used: {},
    active: {},
  });
  const [type, setType] = useState<string>('daily');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [custom, setCustom] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<ReportResponse>(
      `/_reports?type=count_pin&period=${type}${type === 'monthly' ? `&year_month=${formatToYearMonth(startDate)}` : ''}${type === 'custom' ? `&start_date=${formatToYMD(custom[0])}&end_date=${formatToYMD(custom[1])}` : ''}&report_type=details`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        const analytics = data?.data || { used: {}, active: {} };
        setDataAnalytics(analytics);
      })
      .catch((error) => {
        console.error(error);
        setDataAnalytics({ used: {}, active: {} });
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
          <ReportFilter
            handleFilterChange={handleFilterChange}
            type={type}
            startDate={startDate}
            setStartDate={setStartDate}
            custom={custom}
            setCustom={setCustom}
          />
          <StatCardTotal dataOperan={dataAnalytics} />
        </div>
      </div>
    </>
  );
}
