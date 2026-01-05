'use client';

import Table from '@core/components/table';
import {
  reportGeneratePinDetailColumns,
  reportPembagianBonusDetailColumns,
  reportPembayaranBonusDetailColumns,
  reportPembayaranDetailColumns,
  reportPostingPinDetailColumns,
  reportSniperDetailColumns,
} from './columns';
import WidgetCard from '@core/components/cards/widget-card';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import cn from '@core/utils/class-names';
import Filters from './filters';
import { useEffect, useMemo, useState } from 'react';
import { ActivityItem } from '@/types/report-generate-pin';
import { PostingActivityItem } from '@/types/report-posting-pin';
import { ColumnDef } from '@tanstack/react-table';
import { WithdrawalBonusReportDetail } from '@/types/report-pembayaran-bonus';
import { PembagianBonusReportDetail } from '@/types/report-pembagian-bonus';
import { PaymentReportDetail } from '@/types/report-pembayaran';
import { SniperReportDetail } from '@/types/report-sniper';

export default function ReportDetailTable<
  T extends
    | ActivityItem
    | PostingActivityItem
    | PaymentReportDetail
    | WithdrawalBonusReportDetail
    | PembagianBonusReportDetail
    | SniperReportDetail,
>({
  className,
  dataOperan,
  typeReport,
}: {
  className?: string;
  dataOperan: T[];
  typeReport: string;
}) {
  useEffect(() => {
    setData(dataOperan);
  }, [dataOperan]);

  const columnConfig: ColumnDef<T, any>[] = useMemo(() => {
    if (typeReport === 'generate') {
      return reportGeneratePinDetailColumns as unknown as ColumnDef<T, any>[];
    } else if (typeReport === 'posting') {
      return reportPostingPinDetailColumns as unknown as ColumnDef<T, any>[];
    } else if (typeReport === 'pembayaran') {
      return reportPembayaranDetailColumns as unknown as ColumnDef<T, any>[];
    } else if (typeReport === 'pembayaranBonus') {
      return reportPembayaranBonusDetailColumns as unknown as ColumnDef<
        T,
        any
      >[];
    } else if (typeReport === 'pembagianBonus') {
      return reportPembagianBonusDetailColumns as unknown as ColumnDef<
        T,
        any
      >[];
    } else if (typeReport === 'sniper') {
      return reportSniperDetailColumns as unknown as ColumnDef<T, any>[];
    } else {
      return reportGeneratePinDetailColumns as unknown as ColumnDef<T, any>[];
    }
  }, [typeReport]);

  const { table, setData } = useTanStackTable<T>({
    tableData: dataOperan,
    columnConfig,
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      meta: {},
      enableColumnResizing: false,
    },
  });

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <WidgetCard
          className={cn('p-0 lg:p-0', className)}
          title="List Detail"
          titleClassName="w-[19ch]"
          actionClassName="w-full ps-0 items-center"
          headerClassName="mb-6 items-start flex-col @[57rem]:flex-row @[57rem]:items-center px-5 pt-5 lg:pt-7 lg:px-7"
          action={<Filters table={table} />}
        >
          <Table table={table} variant="modern" />
          <TablePagination table={table} className="p-4" />
        </WidgetCard>
      </div>
    </div>
  );
}
