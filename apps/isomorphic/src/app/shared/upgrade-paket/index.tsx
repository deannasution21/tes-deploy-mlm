'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Alert, Button, Text } from 'rizzui';
import {
  PiCheckCircleFill,
  PiCrownFill,
  PiArrowCircleUpBold,
  PiStarFill,
  PiUserPlusFill,
  PiSealCheckFill,
} from 'react-icons/pi';
import cn from '@core/utils/class-names';
import Swal from 'sweetalert2';
import WidgetCard from '@core/components/cards/widget-card';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { routes } from '@/config/routes';
import {
  getPinLabel,
  getPlanLabel,
  PLAN_BENEFITS,
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
        {/* sudah paket tertinggi: tidak ada yang perlu dijelaskan soal upgrade */}
        {upgradeOptions.length > 0 && (
          <Alert variant="flat" color="info">
            <Text className="font-semibold">Informasi Upgrade</Text>
            <ol className="list-disc ps-5">
              <li>
                <Text className="break-normal">
                  Upgrade menggunakan 1 PIN sesuai paket tujuan, diambil
                  otomatis dari PIN aktif milik Anda.
                </Text>
              </li>
              <li>
                <Text className="break-normal">
                  Window <strong>30 hari</strong> dimulai saat ada posting
                  pertama di bawah Anda dari suatu paket. Window dihitung
                  terpisah untuk setiap paket (Pendaftaran, Star, Business).
                </Text>
              </li>
              <li>
                <Text className="break-normal">
                  Upgrade sebelum window berakhir agar bonus dari posting
                  tersebut bisa dicairkan. Jika tidak, bonus di dalam window
                  akan <strong>hangus permanen</strong>.
                </Text>
              </li>
              <li>
                <Text className="break-normal">
                  Bonus dari posting setelah window berakhir tidak hangus,
                  tetapi <strong>terkunci</strong> sampai Anda upgrade.
                </Text>
              </li>
            </ol>
          </Alert>
        )}

        <WindowStatus lockStatus={lockStatus} />

        {/* paket saat ini + pilihan upgrade dalam satu baris, seperti tabel harga */}
        <div
          className={cn(
            'grid grid-cols-1 items-stretch gap-6',
            upgradeOptions.length === 0
              ? 'max-w-xl'
              : upgradeOptions.length === 1
                ? 'md:grid-cols-2'
                : 'md:grid-cols-2 xl:grid-cols-3'
          )}
        >
          <PlanCard
            plan={currentPlan as TypePlan}
            label={getPlanLabel(currentPlan)}
            current={{
              since: user.membership?.[currentPlan]?.crtd_at,
              isHighest: upgradeOptions.length === 0,
            }}
          />
          {upgradeOptions.map(({ value, label }) => (
            <PlanCard
              key={value}
              plan={value}
              label={label}
              pinCount={pinSummary?.[value] ?? 0}
              upgrading={upgrading === value}
              disabled={!!upgrading}
              onUpgrade={() => handleUpgrade(value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const PLAN_THEME: Partial<
  Record<
    TypePlan,
    {
      header: string;
      icon: React.ReactNode;
      check: string;
      button: string;
      ring: string;
      tagline: string;
      badge?: string;
    }
  >
> = {
  free: {
    header: 'from-emerald-500 via-teal-500 to-cyan-600',
    icon: <PiUserPlusFill className="h-7 w-7" />,
    check: 'text-emerald-500',
    button: 'from-emerald-500 to-teal-500',
    ring: 'border-emerald-100',
    tagline: 'Langkah awal bergabung bersama IPG',
  },
  plan_b: {
    header: 'from-sky-500 via-blue-500 to-indigo-600',
    icon: <PiStarFill className="h-7 w-7" />,
    check: 'text-blue-500',
    button: 'from-sky-500 to-indigo-600',
    ring: 'border-blue-100',
    tagline: 'Mulai dapatkan bonus sponsor, pasangan & gaji berulang',
  },
  plan_a: {
    header: 'from-[#AA8453] via-[#c69731] to-[#e0b84a]',
    icon: <PiCrownFill className="h-7 w-7" />,
    check: 'text-[#c69731]',
    button: 'from-[#c69731] via-[#e0b84a] to-[#AA8453]',
    ring: 'border-amber-200 ring-2 ring-amber-100',
    tagline: 'Paket terlengkap: semua bonus, gaji & reward terbuka',
    badge: 'Paling Lengkap',
  },
};

const formatSince = (date?: string) =>
  date
    ? new Date(date.replace(' ', 'T')).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : null;

function PlanCard({
  plan,
  label,
  pinCount = 0,
  upgrading = false,
  disabled = false,
  onUpgrade,
  current,
}: {
  plan: TypePlan;
  label: string;
  pinCount?: number;
  upgrading?: boolean;
  disabled?: boolean;
  onUpgrade?: () => void;
  // diisi untuk kartu paket yang sedang dipakai member
  current?: { since?: string; isHighest: boolean };
}) {
  const theme = PLAN_THEME[plan];
  const benefits = PLAN_BENEFITS[plan] ?? [];
  const hasPin = pinCount > 0;
  const since = formatSince(current?.since);

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300',
        theme?.ring,
        // setelah theme.ring supaya ring hijau "Paket Anda" tidak tertimpa
        current
          ? 'ring-2 ring-green-400 ring-offset-2'
          : 'hover:-translate-y-1 hover:shadow-xl'
      )}
    >
      <div
        className={cn(
          'relative bg-gradient-to-br px-6 pb-6 pt-5 text-white',
          theme?.header
        )}
      >
        {(current || theme?.badge) && (
          <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-white/25 px-3 py-1 text-xs font-semibold backdrop-blur">
            {current && <PiSealCheckFill className="h-3.5 w-3.5" />}
            {current ? 'Paket Anda' : theme?.badge}
          </span>
        )}
        <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white/20">
          {theme?.icon}
        </span>
        <p className="text-2xl font-bold">{label}</p>
        <p className="mt-1 text-sm text-white/85">{theme?.tagline}</p>
        <p className="mt-4">
          <span className="text-3xl font-extrabold">{PIN_PRICE[plan]}</span>
          <span className="ms-1 text-sm text-white/80">
            / {getPinLabel(plan)}
          </span>
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <ul className="space-y-3">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2.5 text-sm">
              <PiCheckCircleFill
                className={cn('mt-0.5 h-5 w-5 shrink-0', theme?.check)}
              />
              <span className="text-gray-700">{benefit}</span>
            </li>
          ))}
        </ul>

        {current ? (
          <div className="mt-auto space-y-2">
            <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              <PiSealCheckFill className="h-5 w-5" />
              {current.isHighest
                ? 'Anda sudah di paket tertinggi'
                : 'Paket aktif Anda'}
            </div>
            {since && (
              <p className="text-center text-xs text-gray-500">
                Aktif sejak {since}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-auto space-y-3">
            <div
              className={cn(
                'flex items-center justify-between rounded-xl px-4 py-2.5 text-sm',
                hasPin
                  ? 'bg-green-50 text-green-700'
                  : 'bg-gray-50 text-gray-600'
              )}
            >
              <span>{getPinLabel(plan)} aktif Anda</span>
              <strong className="text-base">{pinCount}</strong>
            </div>

            {/* upgrade butuh 1 PIN paket tujuan; tanpa PIN tombol disabled */}
            <Button
              size="lg"
              disabled={!hasPin || disabled}
              isLoading={upgrading}
              onClick={onUpgrade}
              className={cn(
                'w-full gap-2 border-0 font-semibold',
                hasPin
                  ? cn(
                      'bg-gradient-to-r text-white shadow-md hover:brightness-105',
                      theme?.button
                    )
                  : 'bg-gray-100 text-gray-400'
              )}
            >
              <PiArrowCircleUpBold className="h-5 w-5" />
              Upgrade ke {label}
            </Button>
            {!hasPin && (
              <p className="text-center text-xs text-gray-500">
                Butuh 1 {getPinLabel(plan)}. Minta transfer PIN dari stockist
                untuk mengaktifkan tombol upgrade.
              </p>
            )}
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
