'use client';

import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Select, Text, Title } from 'rizzui';
import { useSession } from 'next-auth/react';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import cn from '@core/utils/class-names';
import Image from 'next/image';
import pinImg from '@public/assets/img/golden-coin.png';
import Link from 'next/link';
import { routes } from '@/config/routes';
import WithdrawalGajiTable from '../tables/withdrawal-gaji';
import {
  DetailUsers,
  WithdrawalSummaryData,
  WithdrawalSummaryResponse,
} from '@/types/wd-gaji';

const tipePlan = [
  {
    value: 'free',
    label: 'Pasif',
    disabled: true,
  },
  {
    value: 'plan_a',
    label: 'Reguler',
  },
];

function FleetStatus({
  data,
  className,
  akumulasiGaji,
  plan,
}: {
  data?: DetailUsers;
  className?: string;
  akumulasiGaji: string;
  plan: string;
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
              {data?.detail_salary_withdrawal.remaining_points ?? 0} Poin
            </strong>
          </Title>
          <Title as="h6" className="mb-3 text-center">
            Poin Hangus Anda:{' '}
            <strong className="text-xl text-primary">
              {data?.point.bonus_flushed ?? 0} Poin
            </strong>
          </Title>
          <Title as="h6" className="mb-3 text-center">
            Akumulasi Gaji Anda:{' '}
            <strong className="text-xl text-primary">{akumulasiGaji}</strong>
          </Title>
          <Text as="p" className="text-stone-500">
            Withdrawal Gaji dapat dlakukan jika poin Anda sudah mencapai{' '}
            <strong className="text-primary">30 poin</strong>, dan akan
            dicairkan menjadi{' '}
            <strong className="text-primary">Rp 1.500.000</strong>
          </Text>
        </div>
        <div className="relative pb-3 pt-7">
          {!data?.can_withdrawal_salary.can_withdrawal ? (
            <Button className="w-full" disabled>
              Cairkan Gaji
            </Button>
          ) : (
            <Link href={`${routes.withdrawalGaji.withdrawal}?plan=${plan}`}>
              <Button className="w-full">Cairkan Gaji</Button>
            </Link>
          )}
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
  const [selectedPlan, setSelectedPlan] = useState('plan_a');

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<WithdrawalSummaryResponse>(
      `/_transactions/withdrawal-summary?type=${selectedPlan}&category=salary`,
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
  }, [session?.accessToken, selectedPlan]);

  if (isLoading)
    return <p className="py-20 text-center">Sedang memuat data...</p>;

  const belumAktivasiPasif =
    selectedPlan === 'free' &&
    dataGaji?.detail_users?.can_withdrawal_salary?.member_pasif === true;

  return (
    <div className="@container">
      <div className="mb-6 w-full max-w-[220px]">
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

      {belumAktivasiPasif ? (
        <Alert variant="flat" color="danger">
          <Text className="font-semibold">
            Anda Belum Aktivasi sebagai Member Pasif
          </Text>
          <Text className="mt-1 break-normal">
            {dataGaji?.detail_users?.can_withdrawal_salary?.message ??
              'Data gaji tidak dapat ditampilkan karena status Anda masih Member Pasif dan belum diaktivasi.'}
          </Text>
          <Link href={routes.promo.pasif.index}>
            <Button size="sm" className="mt-3">
              Aktivasi Sekarang
            </Button>
          </Link>
        </Alert>
      ) : dataHistory ? (
        <>
          <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-2 @7xl:grid-cols-12 3xl:gap-8">
            {/* FleetStatus first on small screens */}
            <FleetStatus
              data={dataGaji?.detail_users}
              akumulasiGaji={dataGaji?.balance?.currency ?? 'Rp 0'}
              plan={selectedPlan}
              className="order-1 @7xl:order-2 @7xl:col-span-4 @7xl:col-start-9 @7xl:row-start-1 @7xl:row-end-3 @7xl:h-full"
            />

            {/* Table second on small screens */}
            <div className="order-2 @4xl:col-span-2 @7xl:order-1 @7xl:col-span-8 @7xl:min-h-[412px]">
              <div className="rounded-lg border border-muted">
                <WithdrawalGajiTable datanya={dataGaji?.summary ?? []} />
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
