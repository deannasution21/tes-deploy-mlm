'use client';

import { useEffect, useState } from 'react';
import { Badge, Button, Collapse, Text, Title } from 'rizzui';
import { useSession } from 'next-auth/react';
import {
  AmountCurrency,
  BonusCategory,
  GrandTotal,
  HistoryBonusData,
  HistoryBonusResponse,
} from '@/types';
import { PiCaretDownBold } from 'react-icons/pi';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import BasicTableWidget from '@core/components/controlled-table/basic-table-widget';
import cn from '@core/utils/class-names';
import FiltersHistoryBonus from './filters';
import Image from 'next/image';
import pinImg from '@public/assets/img/golden-gift.png';

const getColumns = () => [
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
    title: 'Tanggal',
    dataIndex: 'attribute',
    key: 'attribute',
    width: 150,
    render: ({ created_at }: { created_at: string }) => (
      <Text className="font-medium text-gray-700">{created_at}</Text>
    ),
  },
  {
    title: 'Type PIN',
    dataIndex: 'attribute',
    key: 'attribute',
    width: 150,
    render: ({ plan }: { plan: string }) => (
      <Text className="text-gray-700">PLAN</Text>
    ),
  },
  {
    title: 'Dari',
    dataIndex: 'attribute',
    key: 'attribute',
    width: 150,
    render: ({ from }: { from: string }) => (
      <Text className="text-gray-700">{from}</Text>
    ),
  },
  {
    title: 'Komisi',
    dataIndex: 'attribute',
    key: 'attribute',
    width: 150,
    render: ({ total }: { total: AmountCurrency }) => (
      <Text className="text-gray-700">{total.currency}</Text>
    ),
  },
];

function AccordionContent({
  data,
  type,
}: {
  data: BonusCategory;
  type: string;
}) {
  return (
    <Collapse
      defaultOpen={true}
      header={({ open, toggle }) => (
        <div
          onClick={toggle}
          className="flex cursor-pointer items-center justify-between gap-4 p-3 md:p-5"
        >
          <div className="flex gap-2 sm:items-center md:gap-4">
            <div className="sm:flex sm:flex-col">
              <Title as="h5" className="font-semibold text-gray-900">
                {type === 'bonus_sponsor'
                  ? 'Komisi Sponsor'
                  : type === 'bonus_pairing'
                    ? 'Komisi Pasangan'
                    : ''}
              </Title>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-500',
                open && 'bg-gray-900 text-gray-0'
              )}
            >
              <PiCaretDownBold
                strokeWidth={3}
                className={cn(
                  'h-3 w-3 transition-transform duration-200',
                  open && 'rotate-180 rtl:-rotate-180'
                )}
              />
            </div>
          </div>
        </div>
      )}
    >
      {/* Body */}
      <div className="bg-gray-50 text-gray-500 dark:bg-gray-100">
        <BasicTableWidget
          // title="Table"
          // description=""
          className={cn(
            '-mt-8 border-0 pb-0 lg:pb-0 [&_.rc-table-row:last-child_td]:border-b-0'
          )}
          data={data?.items ?? []}
          getColumns={getColumns}
          noGutter
          enableSearch={false}
          scroll={{
            x: 900,
          }}
        />
      </div>
    </Collapse>
  );
}

function PerBonus({ data, type }: { data: BonusCategory; type: string }) {
  return (
    <>
      <div key={type} className="rounded-lg border border-muted">
        <AccordionContent data={data} type={type} />

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-dashed border-muted p-5 md:flex-nowrap">
          <div className="text-gray-500">
            <Text
              as="span"
              className="text-lg font-semibold text-primary md:text-2xl"
            >
              {data?.total?.currency}
            </Text>{' '}
            <Text as="span">
              total dari{' '}
              <strong className="text-gray-700">{data?.count}</strong> data
            </Text>
          </div>
        </div>
      </div>
    </>
  );
}

function FleetStatus({
  data,
  className,
}: {
  data: GrandTotal;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-5 border-0 p-0 lg:p-0', className)}>
      <div className="grid items-start rounded-lg border border-muted p-5 @xl:grid-cols-2 lg:p-7">
        <Title
          as="h3"
          className="col-span-full mb-8 text-base font-semibold sm:text-lg"
        >
          Total Komisi Anda
        </Title>
        <div className="mx-auto h-40 w-40">
          <div className="relative mx-auto aspect-square">
            <Image
              src={pinImg}
              alt=""
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>

        <div className="">
          <div className="mb-4 flex items-center justify-between border-b border-muted pb-4 last:mb-0 last:border-0 last:pb-0">
            <div className="flex items-center justify-start">
              <Title as="h5" className="text-sm font-semibold">
                Sponsor
              </Title>
            </div>
            <Text as="span">{data?.sponsor?.currency}</Text>
          </div>
          <div className="mb-4 flex items-center justify-between border-b border-muted pb-4 last:mb-0 last:border-0 last:pb-0">
            <div className="flex items-center justify-start">
              <Title as="h5" className="text-sm font-semibold">
                Pasangan
              </Title>
            </div>
            <Text as="span">{data?.pairing?.currency}</Text>
          </div>
          <div className="flex items-center justify-between border-b border-muted pb-4 last:mb-0 last:border-0 last:pb-0">
            <div className="flex items-center justify-start">
              <Title as="h5" className="text-sm font-semibold">
                Total
              </Title>
            </div>
            <Title as="h5" className="text-primary">
              {data?.total?.currency}
            </Title>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HistoryBonusPage({
  bawaUsername,
}: {
  bawaUsername?: string;
}) {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);

  const [dataBonus, setDataBonus] = useState<HistoryBonusData | null>(null);
  const [username, setUsername] = useState(bawaUsername ?? '');
  const now = new Date();
  const yearMonth = now.toISOString().slice(0, 7); // "2025-10"
  const [monthYear, setMonthYear] = useState(yearMonth);

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    const [year, month] = monthYear.split('-');
    const filterMonthYear = `${month}-${year}`; // "10-2025"

    fetchWithAuth<HistoryBonusResponse>(
      `/_commissions?year_month=${filterMonthYear}`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setDataBonus(data.data);
      })
      .catch((error) => {
        console.error(error);
        // Clear the data so UI can show "no data"
        setDataBonus(null);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken, monthYear]);

  if (isLoading)
    return <p className="py-20 text-center">Sedang memuat data...</p>;

  return (
    <div className="@container">
      {dataBonus ? (
        <>
          <div className="">
            <FiltersHistoryBonus
              monthYear={monthYear}
              setMonthYear={setMonthYear}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-2 @7xl:grid-cols-12 3xl:gap-8">
            <div className="@4xl:col-span-2 @7xl:col-span-8 @7xl:min-h-[412px]">
              <div className="grid grid-cols-1 gap-6">
                <PerBonus
                  data={dataBonus?.bonus_sponsor}
                  type="bonus_sponsor"
                />
                <PerBonus
                  data={dataBonus?.bonus_pairing}
                  type="bonus_pairing"
                />
              </div>
            </div>
            <FleetStatus
              data={dataBonus?.grand_total}
              className="h-[464px] @sm:h-[520px] @7xl:col-span-4 @7xl:col-start-9 @7xl:row-start-1 @7xl:row-end-3 @7xl:h-full"
            />
          </div>
        </>
      ) : (
        <div className="py-20 text-center text-gray-500">
          <p>Tidak ada data bonus untuk pengguna/periode ini.</p>
        </div>
      )}
    </div>
  );
}
