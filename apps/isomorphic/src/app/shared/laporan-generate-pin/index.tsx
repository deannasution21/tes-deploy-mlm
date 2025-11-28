'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import {
  ActivityItem,
  ActivityReportResponse,
  Analytics,
} from '@/types/report-generate-pin';
import ReportGeneratePinDetailTable from '../tables/laporan-generate-pin/detail';
import ReportGeneratePinStatGrid from './status';

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
  const [type, setType] = useState<string>('monthly');

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<ActivityReportResponse>(
      `/_reports?type=generate_pin&period=${type}&report_type=details`,
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
  }, [session?.accessToken, type]);

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    setLoading(false);
  }, [session?.accessToken]);

  if (isLoading)
    return <p className="py-20 text-center">Sedang memuat data...</p>;

  return (
    <>
      <div className="@container">
        <div className="grid grid-cols-1 gap-6 3xl:gap-8">
          <ReportGeneratePinStatGrid dataOperan={dataAnalytics} />
          <ReportGeneratePinDetailTable dataOperan={dataReportDetails} />
        </div>
      </div>
    </>
  );
}
