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
import { DealerSummaryResponse, UserData, UserDataResponse } from '@/types';

const PIN_PRICE: Record<TypePlan, string> = {
  free: 'Rp25.000',
  plan_b: 'Rp200.000',
  plan_a: 'Rp500.000',
};

const planRank = (plan?: string | null) =>
  PLAN_OPTIONS.findIndex((p) => p.value === plan);

export default function UpgradePaketPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<TypePlan | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [pinSummary, setPinSummary] = useState<Record<string, number>>({});

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
    ])
      .then(([userRes, pinRes]) => {
        setUser(userRes?.data?.attribute ?? null);
        setPinSummary(pinRes?.data?.summary ?? {});
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
                Bonus dari setiap sumber memiliki window{' '}
                <strong>30 hari</strong>. Bonus di dalam window yang belum
                di-upgrade sampai window berakhir akan{' '}
                <strong>hangus permanen</strong>.
              </Text>
            </li>
            <li>
              <Text className="break-normal">
                Bonus dari posting setelah window berakhir berstatus{' '}
                <strong>terkunci</strong> dan akan cair setelah Anda upgrade.
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
