'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import {
  ActivityItem,
  ActivityReportResponse,
  Analytics,
} from '@/types/report-generate-pin';
import ReportStatGrid from '../status';
import ReportDetailTable from '../../tables/laporan/detail';
import { formatToYMD, formatToYearMonth } from '@/utils/helper';
import ReportFilter from '../filter';

export default function ReportGeneratePinPage({
  className,
}: {
  className?: string;
}) {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);

  const [dataAnalytics, setDataAnalytics] = useState<Analytics | null>(null);
  const [dataReportDetails, setDataReportDetails] = useState<ActivityItem[]>(
    []
  );
  const [type, setType] = useState<string>('daily');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [custom, setCustom] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<ActivityReportResponse>(
      `/_reports?type=generate_pin&period=${type}${type === 'monthly' ? `&year_month=${formatToYearMonth(startDate)}` : ''}${type === 'custom' ? `&start_date=${formatToYMD(custom[0])}&end_date=${formatToYMD(custom[1])}` : ''}&report_type=details`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        const dataAnalytics = data?.data?.analytics || null;
        const dataDetails = data?.data?.details?.items || [];
        setDataAnalytics(dataAnalytics);
        setDataReportDetails(dataDetails);
      })
      .catch((error) => {
        console.error(error);
        setDataAnalytics(null);
        setDataReportDetails([]);
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
          <ReportStatGrid dataOperan={dataAnalytics} typeReport="generate" />
          <ReportDetailTable
            dataOperan={dataReportDetails}
            typeReport="generate"
          />
        </div>
      </div>
    </>
  );
}
