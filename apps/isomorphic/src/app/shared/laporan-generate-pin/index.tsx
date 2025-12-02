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
import DropdownAction from '../dropdown-action';
import { DatePicker } from '@core/ui/datepicker';
import DateFiled from '@core/components/controlled-table/date-field';

const filterOptions = [
  {
    value: 'daily',
    label: 'Harian',
  },
  {
    value: 'weekly',
    label: 'Mingguan',
  },
  {
    value: 'monthly',
    label: 'Bulanan',
  },
  {
    value: 'custom',
    label: 'Custom',
  },
];

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

  function formatToYearMonth(dateStr: any) {
    const date = new Date(dateStr);

    // Prevent invalid date error
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }

    const formatted = date.toISOString().slice(0, 7);
    return formatted;
  }

  function formatToYMD(dateStr: any) {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

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
          <div className="flex w-full max-w-lg flex-wrap gap-4">
            <DropdownAction
              className="w-full rounded-md border 3xl:w-auto"
              options={filterOptions}
              onChange={handleFilterChange}
              value={type} // Pass current value
            />
            {type === 'monthly' && (
              <div className="w-full 3xl:w-auto">
                <DatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => setStartDate(date)}
                  dateFormat="MMM, yyyy"
                  placeholderText="Select Month"
                  showMonthYearPicker
                  popperPlacement="bottom-end"
                  inputProps={{
                    variant: 'text',
                    inputClassName: 'h-auto [&_input]:text-ellipsis',
                  }}
                  className="rounded-md border"
                />
              </div>
            )}
            {type === 'custom' && (
              <div className="w-full 3xl:w-auto">
                <DateFiled
                  selected={custom[0]}
                  startDate={custom[0]!}
                  endDate={custom[1]!}
                  onChange={(date) => setCustom(date)}
                  selectsRange
                  dateFormat="dd MMM yyyy"
                  placeholderText="Pilih tanggal"
                  maxDate={new Date()}
                  className=""
                />
              </div>
            )}
          </div>
          <ReportGeneratePinStatGrid dataOperan={dataAnalytics} />
          <ReportGeneratePinDetailTable dataOperan={dataReportDetails} />
        </div>
      </div>
    </>
  );
}
