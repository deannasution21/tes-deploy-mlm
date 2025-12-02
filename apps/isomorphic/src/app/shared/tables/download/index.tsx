'use client';

import Table from '@core/components/table';
import { listDownloadColumns } from './columns';
import WidgetCard from '@core/components/cards/widget-card';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import cn from '@core/utils/class-names';
import Filters from './filters';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export interface DownloadItem {
  name: string;
  format: string;
  url: string;
}

export default function DownloadTable({ className }: { className?: string }) {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);

  const [dataDownload, setDataDownload] = useState<DownloadItem[]>([]);
  const [type, setType] = useState<string>('received');

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    const datanya = [
      {
        name: 'KeyNote IPG Marketing Plan',
        format: '.key',
        url: '/files/KeynoteIPG_Marketing_plan.key',
      },
      {
        name: 'Windows IPG Marketing Plan',
        format: '.pdf',
        url: '/files/Windows_IPG_Marketing_plan.pdf',
      },
      {
        name: 'KeyNote IPG Marketing Plan',
        format: '.pptx',
        url: '/files/Windows_IPG_Marketing_plan.pptx',
      },
      {
        name: 'Kopi Sniper Produk Knowledge',
        format: '.pptx',
        url: '/files/Kopi_Sniper_Produk_Knowledge.pptx',
      },
      {
        name: 'Lilac Lace Knowledge',
        format: '.pptx',
        url: '/files/Lilac_Lace_Knowledge.pptx',
      },
      {
        name: 'HNB Product Knowledge',
        format: '.pptx',
        url: '/files/HNB_Produk_Knowledge.pptx',
      },
    ];
    setDataDownload(datanya);
    setData(datanya);

    setLoading(false);
  }, [session?.accessToken]);

  const { table, setData } = useTanStackTable<DownloadItem>({
    tableData: dataDownload,
    columnConfig: listDownloadColumns,
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

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p>Sedang memuat data...</p>
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <WidgetCard
          className={cn('p-0 lg:p-0', className)}
          title="List File"
          titleClassName="w-[19ch]"
          actionClassName="w-full ps-0 items-center"
          headerClassName="mb-6 items-start flex-col @[57rem]:flex-row @[57rem]:items-center px-5 pt-5 lg:pt-7 lg:px-7"
          action={<Filters table={table} type={type} setType={setType} />}
        >
          <Table table={table} variant="modern" />
          <TablePagination table={table} className="p-4" />
        </WidgetCard>
      </div>
    </div>
  );
}
