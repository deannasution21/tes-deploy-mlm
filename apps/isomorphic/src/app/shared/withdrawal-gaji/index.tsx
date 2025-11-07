'use client';

import { useEffect, useState } from 'react';
import { Badge, Button, Text, Title } from 'rizzui';
import { useSession } from 'next-auth/react';
import {
  AmountCurrency,
  NetworkNode,
  WithdrawalSummaryData,
  WithdrawalSummaryResponse,
  WithdrawalUserDetail,
} from '@/types';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import cn from '@core/utils/class-names';
import Image from 'next/image';
import pinImg from '@public/assets/img/golden-coin.png';
import Link from 'next/link';
import { routes } from '@/config/routes';
import BasicTableWidget from '@core/components/controlled-table/basic-table-widget';

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
    title: 'Username',
    dataIndex: 'username',
    key: 'username',
    width: 150,
    render: (username: string) => (
      <Text className="font-medium text-gray-700">{username}</Text>
    ),
  },
  {
    title: 'Gaji',
    dataIndex: 'balance',
    key: 'balance',
    width: 150,
    render: (balance: AmountCurrency) => (
      <Text className="text-gray-700">{balance.currency}</Text>
    ),
  },
];

function FleetStatus({
  data,
  className,
}: {
  data?: WithdrawalUserDetail;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-5 border-0 p-0 lg:p-0', className)}>
      <div className="rounded-lg border border-muted p-5 lg:p-7">
        <Title
          as="h3"
          className="col-span-full mb-8 text-center text-base font-semibold sm:text-lg"
        >
          Informasi Poin Anda
        </Title>
        <div className="mx-auto mb-5 h-40 w-40">
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
        <div className="mb-2 text-center">
          <Title as="h4" className="text-primary">
            {data?.name}
          </Title>
        </div>
        <div className="mb-5 flex justify-center gap-2">
          <Badge
            variant="flat"
            rounded="pill"
            className="font-medium"
            color="primary"
          >
            <div className="flex items-center justify-start gap-2">
              <Title as="h5" className="text-sm font-semibold">
                Poin Kiri:
              </Title>
              <Text as="span" className="text-lg">
                {data?.point?.point_left ?? 0}
              </Text>
            </div>
          </Badge>
          <Badge
            variant="flat"
            rounded="pill"
            className="font-medium"
            color="primary"
          >
            <div className="flex items-center justify-start gap-2">
              <Title as="h5" className="text-sm font-semibold">
                Poin Kanan:
              </Title>
              <Text as="span" className="text-lg">
                {data?.point?.point_right ?? 0}
              </Text>
            </div>
          </Badge>
        </div>
        <div className="relative border-b border-gray-300 pb-7 text-center">
          <Title as="h6" className="mb-3 text-center">
            Total Poin Anda:{' '}
            <strong className="text-xl text-primary">
              {data?.point?.total_point ?? 0} Poin
            </strong>
          </Title>
          <Text as="p" className="text-stone-500">
            Withdrawal Gaji dapat dlakukan jika poin Anda sudah mencapai{' '}
            <strong className="text-primary">25 poin</strong>, dan akan
            dicairkan menjadi{' '}
            <strong className="text-primary">Rp 1.500.000</strong>
          </Text>
        </div>
        <div className="relative pb-3 pt-7">
          <Link href={routes.withdrawalGaji.withdrawal}>
            <Button className="w-full">Cairkan Gaji</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function WithdrawalGajiPage() {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);

  const [dataGaji, setDataGaji] = useState<WithdrawalSummaryData | null>(null);
  const [dataHistory, setDataHistory] = useState<any[]>([]);

  const dataDummy: NetworkNode = {
    user_id: 'admin',
    name: 'Admin',
    location: 'Bandung',
    position: 'left',
    point_left: 33,
    point_right: 33,
    upline: 'sistem',
    isPlaceholder: false,
    hasData: true,
    children: [],
    childrenCount: 2,
  };

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<WithdrawalSummaryResponse>(
      `/_transactions/withdrawal-summary?type=plan_a&category=salary`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setDataGaji(data.data);
      })
      .catch((error) => {
        console.error(error);
        // Clear the data so UI can show "no data"
        setDataGaji(null);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  if (isLoading)
    return <p className="py-20 text-center">Sedang memuat data...</p>;

  return (
    <div className="@container">
      {dataHistory ? (
        <>
          <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-2 @7xl:grid-cols-12 3xl:gap-8">
            {/* FleetStatus first on small screens */}
            <FleetStatus
              data={dataGaji?.detail_users}
              className="order-1 @7xl:order-2 @7xl:col-span-4 @7xl:col-start-9 @7xl:row-start-1 @7xl:row-end-3 @7xl:h-full"
            />

            {/* Table second on small screens */}
            <div className="order-2 @4xl:col-span-2 @7xl:order-1 @7xl:col-span-8 @7xl:min-h-[412px]">
              <div className="rounded-lg border border-muted">
                <BasicTableWidget
                  title="Daftar Akumulasi Gaji"
                  description="ID dengan rekening yang sama"
                  className={cn('[&_.rc-table-row:last-child_td]:border-b-0')}
                  data={dataGaji?.summary ?? []}
                  getColumns={getColumns}
                  noGutter
                  enablePagination={true}
                  enableSearch={true}
                  scroll={{
                    x: 400,
                  }}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="py-20 text-center text-gray-500">
          <p>Tidak ada data gaji untuk pengguna ini.</p>
        </div>
      )}
    </div>
  );
}
