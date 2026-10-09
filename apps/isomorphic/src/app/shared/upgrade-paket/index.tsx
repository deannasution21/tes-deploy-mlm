'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Alert, Badge, Button, Text } from 'rizzui';
import Swal from 'sweetalert2';
import WidgetCard from '@core/components/cards/widget-card';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { routes } from '@/config/routes';
import {
  getPinLabel,
  getPlanLabel,
  PLAN_OPTIONS,
  TypePlan,
} from '@/config/plans';
import {
  DealerSummaryResponse,
  NetworkDiagramResponse,
  NetworkNode,
  SourceLockStatus,
  UserData,
  UserDataResponse,
} from '@/types';

const PIN_PRICE: Record<TypePlan, string> = {
  free: 'Rp25.000',
  plan_b: 'Rp200.000',
  plan_a: 'Rp500.000',
};

const planRank = (plan?: string | null) =>
  PLAN_OPTIONS.findIndex((p) => p.value === plan);

// sumber bonus = paket dari downline yang posting di bawah akun
const SOURCES: {
  key: keyof NonNullable<NetworkNode['lock_status']>;
  plan: TypePlan;
}[] = [
  { key: 'free_source', plan: 'free' },
  { key: 'plan_b_source', plan: 'plan_b' },
  { key: 'plan_a_source', plan: 'plan_a' },
];

const formatDateID = (date: string) =>
  new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

export default function UpgradePaketPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<TypePlan | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [pinSummary, setPinSummary] = useState<Record<string, number>>({});
  const [lockStatus, setLockStatus] = useState<NetworkNode['lock_status']>();

  const getData = () => {
    if (!session?.accessToken) return;

    const id = session.user?.id;
    setLoading(true);

    Promise.all([
      fetchWithAuth<UserDataResponse>(
        `/_users/${id}`,
        { method: 'GET' },
        session.accessToken
      ),
      fetchWithAuth<DealerSummaryResponse>(
        `/_pins/dealer/${id}?fetch=summary&status=active`,
        { method: 'GET' },
        session.accessToken
      ),
      // hanya untuk info window; halaman tetap jalan kalau gagal
      fetchWithAuth<NetworkDiagramResponse>(
        `/_network-diagrams/${id}`,
        { method: 'GET' },
        session.accessToken
      ).catch(() => null),
    ])
      .then(([userRes, pinRes, diagramRes]) => {
        setUser(userRes?.data?.attribute ?? null);
        setPinSummary(pinRes?.data?.summary ?? {});
        setLockStatus(diagramRes?.data?.lock_status);
      })
      .catch((error: any) => {
        console.error(error);
        setUser(null);
      })
      .finally(() => setLoading(false));
  };

  const doUpgrade = (plan: TypePlan) => {
    if (!session?.accessToken) return;

    setUpgrading(plan);
    // PIN diambil otomatis oleh backend dari akun yang login
    fetchWithAuth<any>(
      `/_network-diagrams`,
      {
        method: 'POST',
        body: JSON.stringify({ mode: 'upgrade', type_plan: plan }),
      },
      session.accessToken
    )
      .then((res) => {
        Swal.fire({
          title: 'Upgrade Berhasil',
          html:
            res?.message ??
            `Akun Anda berhasil diupgrade ke paket <b>${getPlanLabel(plan)}</b>.`,
          icon: 'success',
          confirmButtonText: 'Tutup',
          confirmButtonColor: '#ca8a04',
        }).then(() => getData());
      })
      .catch((error: any) => {
        console.error(error);
        Swal.fire({
          title: 'Upgrade Gagal',
          html: error?.message ?? 'Terjadi kesalahan saat melakukan upgrade.',
          icon: 'error',
          confirmButtonText: 'Tutup',
          confirmButtonColor: '#ca8a04',
        });
      })
      .finally(() => setUpgrading(null));
  };

  const handleUpgrade = (plan: TypePlan) => {
    Swal.fire({
      title: 'Konfirmasi Upgrade',
      html: `Upgrade akun Anda ke paket <b>${getPlanLabel(plan)}</b>? 1 ${getPinLabel(plan)} akan digunakan.`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Lanjutkan',
      cancelButtonText: 'Batal',
      customClass: {
        confirmButton:
          'bg-[#AA8453] hover:bg-[#a16207] text-white font-semibold px-4 py-2 rounded me-3',
        cancelButton:
          'bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded',
      },
      buttonsStyling: false,
    }).then((result: any) => {
      if (result.isConfirmed) doUpgrade(plan);
    });
  };

  useEffect(() => {
    if (!session?.accessToken) return;

    if (session?.user?.role !== 'member') {
      router.push(routes.unauthorized.index);
      return;
    }

    getData();
  }, [session?.accessToken]);

  if (isLoading)
    return <p className="py-20 text-center">Sedang memuat data...</p>;

  if (!user)
    return (
      <Alert variant="flat" color="danger">
        <Text>Data akun tidak dapat dimuat. Silakan coba lagi nanti.</Text>
      </Alert>
    );

  const currentPlan = user.type_plan ?? 'free';
  const upgradeOptions = PLAN_OPTIONS.filter(
    (p) => planRank(p.value) > planRank(currentPlan)
  );

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <Alert variant="flat" color="info">
          <Text className="font-semibold">Informasi Upgrade</Text>
          <ol className="list-disc ps-5">
            <li>
              <Text className="break-normal">
                Upgrade menggunakan 1 PIN sesuai paket tujuan, diambil otomatis
                dari PIN aktif milik Anda.
              </Text>
            </li>
            <li>
              <Text className="break-normal">
                Window <strong>30 hari</strong> dimulai saat ada posting pertama
                di bawah Anda dari suatu paket. Window dihitung terpisah untuk
                setiap paket (Pasif, Star, Business).
              </Text>
            </li>
            <li>
              <Text className="break-normal">
                Upgrade sebelum window berakhir agar bonus dari posting tersebut
                bisa dicairkan. Jika tidak, bonus di dalam window akan{' '}
                <strong>hangus permanen</strong>.
              </Text>
            </li>
            <li>
              <Text className="break-normal">
                Bonus dari posting setelah window berakhir tidak hangus, tetapi{' '}
                <strong>terkunci</strong> sampai Anda upgrade.
              </Text>
            </li>
          </ol>
        </Alert>

        <WidgetCard
          title={<span className="text-[#c69731]">Paket Anda</span>}
          titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Text className="text-2xl font-bold text-gray-800">
              {getPlanLabel(currentPlan)}
            </Text>
            {user.member_pasif && (
              <Badge variant="flat" color="warning">
                Member Pasif
              </Badge>
            )}
          </div>
        </WidgetCard>

        <WindowStatus lockStatus={lockStatus} />

        {upgradeOptions.length === 0 ? (
          <Alert variant="flat" color="success">
            <Text className="break-normal">
              Paket Anda sudah <strong>{getPlanLabel(currentPlan)}</strong>,
              paket tertinggi saat ini.
            </Text>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {upgradeOptions.map(({ value, label }) => {
              const pinCount = pinSummary?.[value] ?? 0;

              return (
                <div
                  key={value}
                  className="flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-sm"
                >
                  <div className="space-y-2">
                    <Text className="text-xl font-bold text-gray-800">
                      {label}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Harga {getPinLabel(value)}: {PIN_PRICE[value]}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {getPinLabel(value)} aktif Anda:{' '}
                      <strong>{pinCount}</strong>
                    </Text>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button
                      disabled={pinCount < 1 || !!upgrading}
                      isLoading={upgrading === value}
                      onClick={() => handleUpgrade(value)}
                    >
                      Upgrade ke {label}
                    </Button>
                    {pinCount < 1 && (
                      <Link prefetch={false} href={routes.produk.index}>
                        <Button variant="outline">
                          Beli {getPinLabel(value)}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function WindowStatus({
  lockStatus,
}: {
  lockStatus?: NetworkNode['lock_status'];
}) {
  // hanya sumber yang masih terkunci dan window-nya sudah dimulai
  const windows = SOURCES.map(({ key, plan }) => ({
    plan,
    lock: lockStatus?.[key] as SourceLockStatus | undefined,
  })).filter(({ lock }) => lock && !lock.unlocked && lock.started_at);

  if (windows.length === 0) return null;

  return (
    <WidgetCard
      title={<span className="text-[#c69731]">Window Bonus Anda</span>}
      titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
    >
      <div className="grid grid-cols-1 gap-3">
        {windows.map(({ plan, lock }) => (
          <Alert
            key={plan}
            variant="flat"
            color={lock!.expired ? 'danger' : 'warning'}
          >
            <Text className="font-semibold">
              Bonus dari posting {getPlanLabel(plan)}
            </Text>
            {lock!.expired ? (
              <Text className="mt-1 break-normal">
                Window berakhir {formatDateID(lock!.expires_at!)}. Bonus di
                dalam window tersebut sudah hangus; bonus dari posting
                berikutnya terkunci sampai Anda upgrade.
              </Text>
            ) : (
              <Text className="mt-1 break-normal">
                Window dimulai {formatDateID(lock!.started_at!)}. Upgrade
                sebelum <strong>{formatDateID(lock!.expires_at!)}</strong> agar
                bonus ini bisa dicairkan.
              </Text>
            )}
          </Alert>
        ))}
      </div>
    </WidgetCard>
  );
}
