'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useReactToPrint } from 'react-to-print';
import { Alert, Button, Text } from 'rizzui';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import WidgetCard from '@core/components/cards/widget-card';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { routes } from '@/config/routes';
import {
  ClaimRewardResponse,
  RewardPasifData,
  RewardPasifResponse,
  RewardPasifTier,
  RewardTierStatus,
  VoucherDetail,
} from '@/types/reward-pasif';
import VoucherPrint, { PrintVoucherButton } from './voucher-print';
import {
  PiCheckCircleBold,
  PiGiftBold,
  PiHourglassBold,
  PiLockBold,
  PiRocketLaunchBold,
  PiTargetBold,
  PiXCircleBold,
} from 'react-icons/pi';
import cn from '@core/utils/class-names';

// tampilan kartu per status. "Belum tercapai" sengaja dibuat hidup (bukan
// disabled) supaya member tetap semangat mengejar target.
const TIER_THEME: Record<
  RewardTierStatus,
  {
    label: string;
    accent: string;
    iconWrap: string;
    badge: string;
    bar: string;
    card: string;
    icon: React.ReactNode;
  }
> = {
  eligible: {
    label: 'Siap Diklaim',
    accent: 'bg-gradient-to-r from-emerald-400 to-green-500',
    iconWrap: 'bg-emerald-50 text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700',
    bar: 'bg-gradient-to-r from-emerald-400 to-green-500',
    card: 'border-emerald-200 shadow-md ring-1 ring-emerald-100',
    icon: <PiGiftBold className="h-6 w-6" />,
  },
  claimed: {
    label: 'Sudah Diklaim',
    accent: 'bg-gradient-to-r from-[#c69731] to-[#e0b84a]',
    iconWrap: 'bg-amber-50 text-[#c69731]',
    badge: 'bg-amber-50 text-amber-700',
    bar: 'bg-gradient-to-r from-[#c69731] to-[#e0b84a]',
    card: 'border-amber-200',
    icon: <PiCheckCircleBold className="h-6 w-6" />,
  },
  not_reached: {
    label: 'Sedang Dikejar',
    accent: 'bg-gradient-to-r from-sky-400 to-indigo-500',
    iconWrap: 'bg-indigo-50 text-indigo-600',
    badge: 'bg-indigo-50 text-indigo-700',
    bar: 'bg-gradient-to-r from-sky-400 to-indigo-500',
    card: 'border-gray-200',
    icon: <PiTargetBold className="h-6 w-6" />,
  },
  locked: {
    label: 'Terkunci',
    accent: 'bg-gradient-to-r from-orange-400 to-amber-400',
    iconWrap: 'bg-orange-50 text-orange-500',
    badge: 'bg-orange-50 text-orange-700',
    bar: 'bg-gradient-to-r from-orange-400 to-amber-400',
    card: 'border-orange-200',
    icon: <PiLockBold className="h-6 w-6" />,
  },
  pending: {
    label: 'Menunggu',
    accent: 'bg-gradient-to-r from-sky-400 to-blue-500',
    iconWrap: 'bg-sky-50 text-sky-600',
    badge: 'bg-sky-50 text-sky-700',
    bar: 'bg-gradient-to-r from-sky-400 to-blue-500',
    card: 'border-sky-200',
    icon: <PiHourglassBold className="h-6 w-6" />,
  },
  expired: {
    label: 'Hangus',
    accent: 'bg-gray-300',
    iconWrap: 'bg-gray-100 text-gray-400',
    badge: 'bg-red-50 text-red-600',
    bar: 'bg-gray-300',
    card: 'border-gray-200 bg-gray-50/70',
    icon: <PiXCircleBold className="h-6 w-6" />,
  },
};

// filter chip di Daftar Reward; "Siap Diklaim" hanya muncul kalau ada isinya
type TierFilter = 'all' | 'eligible' | 'not_reached' | 'claimed' | 'expired';

const TIER_FILTERS: {
  value: TierFilter;
  label: string;
  match: (status: RewardTierStatus) => boolean;
  hideWhenEmpty?: boolean;
}[] = [
  { value: 'all', label: 'Semua', match: () => true },
  {
    value: 'eligible',
    label: 'Siap Diklaim',
    match: (s) => s === 'eligible',
    hideWhenEmpty: true,
  },
  {
    value: 'not_reached',
    label: 'Belum Tercapai',
    match: (s) => s === 'not_reached' || s === 'locked' || s === 'pending',
  },
  { value: 'claimed', label: 'Sudah Diklaim', match: (s) => s === 'claimed' },
  { value: 'expired', label: 'Hangus', match: (s) => s === 'expired' },
];

const formatDateID = (date?: string | null) => {
  if (!date) return '-';
  return new Date(date.replace(' ', 'T')).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export default function RewardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState<TierFilter>('all');
  const [data, setData] = useState<RewardPasifData | null>(null);

  // voucher yang sedang dicetak; react-to-print membuka dialog print
  // (bisa "Save as PDF") dari elemen VoucherPrint di bawah
  const printRef = useRef<HTMLDivElement>(null);
  const [printVoucher, setPrintVoucher] = useState<VoucherDetail | null>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: printVoucher?.voucher_code ?? 'Voucher',
    onAfterPrint: () => setPrintVoucher(null),
  });

  useEffect(() => {
    if (printVoucher) handlePrint();
  }, [printVoucher]);

  const getData = () => {
    if (!session?.accessToken) return;

    setLoading(true);
    fetchWithAuth<RewardPasifResponse>(
      `/_transactions/withdrawal-summary?type=free&category=reward`,
      { method: 'GET' },
      session.accessToken
    )
      .then((res) => setData(res?.data ?? null))
      .catch((error: any) => {
        console.error(error);
        setData(null);
      })
      .finally(() => setLoading(false));
  };

  const doClaim = (tier: RewardPasifTier) => {
    if (!session?.accessToken) return;

    setClaimingId(tier.id);
    fetchWithAuth<ClaimRewardResponse>(
      `/_transactions`,
      {
        method: 'POST',
        body: JSON.stringify({
          username: session.user?.id,
          type: 'claim_reward',
          tier_id: tier.id,
          type_plan: 'free',
        }),
      },
      session.accessToken
    )
      .then((res) => {
        const voucher = res?.data?.voucher_detail;
        const message =
          res?.message ?? `Reward <b>${tier.name}</b> berhasil diklaim.`;

        Swal.fire({
          title: 'Klaim Berhasil',
          html: voucher
            ? `${message}<br/><br/>Voucher Anda siap dicetak.`
            : `${message}<br/><br/>Reward diklaim, menunggu pencairan oleh admin.`,
          icon: 'success',
          confirmButtonText: voucher ? 'Cetak Voucher' : 'Tutup',
          confirmButtonColor: '#ca8a04',
        }).then(() => {
          if (voucher?.printable) setPrintVoucher(voucher);
          getData();
        });
      })
      .catch((error: any) => {
        console.error(error);
        Swal.fire({
          title: 'Klaim Gagal',
          html: error?.message ?? 'Terjadi kesalahan saat mengklaim reward.',
          icon: 'error',
          confirmButtonText: 'Tutup',
          confirmButtonColor: '#ca8a04',
        });
      })
      .finally(() => setClaimingId(null));
  };

  const handleClaim = (tier: RewardPasifTier) => {
    Swal.fire({
      title: 'Konfirmasi Klaim',
      html: `Klaim reward <b>${tier.name}</b> sekarang?`,
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
      if (result.isConfirmed) doClaim(tier);
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

  if (!data)
    return (
      <Alert variant="flat" color="danger">
        <Text>Data reward tidak dapat dimuat. Silakan coba lagi nanti.</Text>
      </Alert>
    );

  const user = data.detail_users;
  const tiers = data.reward_tiers ?? [];
  const activeFilter =
    TIER_FILTERS.find((f) => f.value === tierFilter) ?? TIER_FILTERS[0];
  const filteredTiers = tiers.filter((t) => activeFilter.match(t.status));

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <Alert variant="flat" color="info">
          <Text className="font-semibold">Informasi</Text>
          <ol className="list-disc ps-5">
            <li>
              <Text className="break-normal">
                Kumpulkan pasangan poin reward (kiri : kanan) dari jaringan Anda
                dan tukarkan dengan hadiah.
              </Text>
            </li>
            <li>
              <Text className="break-normal">
                Klaim reward hanya untuk akun paket <strong>Business</strong>.
              </Text>
            </li>
            <li>
              <Text className="break-normal">
                Reward voucher dapat dicetak setelah diklaim. Tunjukkan voucher
                ke perusahaan untuk penebusan hadiah.
              </Text>
            </li>
            <li>
              <Text className="break-normal">
                Reward tunai yang sudah diklaim menunggu pencairan oleh admin.
              </Text>
            </li>
            <li>
              <Text className="break-normal">
                Reward berstatus <strong>Hangus</strong> tidak dapat diklaim
                lagi.
              </Text>
            </li>
          </ol>
        </Alert>

        {user?.can_claim_reward === false && user?.type_plan !== 'plan_a' ? (
          <Alert variant="flat" color="warning">
            <Text className="break-normal">
              Klaim reward hanya untuk akun paket Business. Upgrade paket Anda
              agar reward yang tercapai dapat diklaim.
            </Text>
            <Link prefetch={false} href={routes.upgradePaket.index}>
              <Button size="sm" className="mt-3">
                Upgrade Paket
              </Button>
            </Link>
          </Alert>
        ) : (
          user?.can_claim_reward === false && (
            <Alert variant="flat" color="warning">
              <Text className="break-normal">
                Akun Anda saat ini belum dapat mengklaim reward.
              </Text>
            </Alert>
          )
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Poin Reward Efektif"
            value={(user?.effective_point ?? 0).toLocaleString('id-ID')}
          />
          <SummaryCard
            title="Poin Reward Kiri : Kanan"
            value={`${(user?.point_pasif_left ?? 0).toLocaleString('id-ID')} : ${(user?.point_pasif_right ?? 0).toLocaleString('id-ID')}`}
          />
          <SummaryCard
            title="Total Reward Tunai Diklaim"
            value={formatRupiah(user?.claimed_total)}
            note={
              user?.balance !== undefined && user?.withdrawn_total !== undefined
                ? `Sudah ditarik ${formatRupiah(user.withdrawn_total)} · Saldo ${formatRupiah(user.balance)}`
                : undefined
            }
          />
        </div>

        <WidgetCard
          title={<span className="text-[#c69731]">Daftar Reward</span>}
          titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
        >
          <div className="mb-5 flex flex-wrap gap-2">
            {TIER_FILTERS.map(({ value, label, match, hideWhenEmpty }) => {
              const count = tiers.filter((t) => match(t.status)).length;
              if (hideWhenEmpty && count === 0) return null;
              const active = tierFilter === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTierFilter(value)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                    active
                      ? 'border-[#c69731] bg-[#c69731] text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-[#c69731] hover:text-[#c69731]'
                  )}
                >
                  {label}
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-semibold',
                      active
                        ? 'bg-white/25 text-white'
                        : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredTiers.length === 0 && (
            <p className="py-10 text-center text-sm text-gray-500">
              Belum ada reward di kategori ini.
            </p>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredTiers.map((tier) => (
              <TierCard
                key={tier.id}
                tier={tier}
                claiming={claimingId === tier.id}
                disabled={!!claimingId}
                onClaim={() => handleClaim(tier)}
                onPrint={() => setPrintVoucher(tier.voucher_detail!)}
                cash={{
                  balance: user?.balance,
                  withdrawn: user?.withdrawn_total,
                }}
              />
            ))}
          </div>
        </WidgetCard>

        {(data.claimed_vouchers?.length ?? 0) > 0 && (
          <WidgetCard
            title={<span className="text-[#c69731]">Voucher Saya</span>}
            titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.claimed_vouchers!.map((voucher) => (
                <div
                  key={voucher.voucher_code}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-dashed border-[#c69731] p-4"
                >
                  <div>
                    <p className="font-mono text-xs text-gray-500">
                      {voucher.voucher_code}
                    </p>
                    <p className="text-lg font-bold text-gray-800">
                      {voucher.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Diklaim {formatDateID(voucher.claimed_at)}
                    </p>
                  </div>
                  {voucher.printable && (
                    <PrintVoucherButton
                      onClick={() => setPrintVoucher(voucher)}
                    />
                  )}
                </div>
              ))}
            </div>
          </WidgetCard>
        )}
      </div>

      {/* sumber cetak, tidak tampil di layar */}
      <div className="hidden">
        {printVoucher && <VoucherPrint ref={printRef} voucher={printVoucher} />}
      </div>
    </div>
  );
}

type CashInfo = { balance?: number; withdrawn?: number };

function TierCard({
  tier,
  claiming,
  disabled,
  onClaim,
  onPrint,
  cash,
}: {
  tier: RewardPasifTier;
  claiming: boolean;
  disabled: boolean;
  onClaim: () => void;
  onPrint: () => void;
  cash: CashInfo;
}) {
  const theme = TIER_THEME[tier.status] ?? TIER_THEME.not_reached;
  const percent = Math.min(tier.progress?.percent ?? 0, 100);
  const target = tier.point_required.toLocaleString('id-ID');
  const isExpired = tier.status === 'expired';

  return (
    <div
      className={cn(
        'relative flex flex-col gap-4 overflow-hidden rounded-2xl border bg-white p-5 pt-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg',
        theme.card
      )}
    >
      <div className={cn('absolute inset-x-0 top-0 h-1.5', theme.accent)} />

      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'grid h-11 w-11 shrink-0 place-items-center rounded-xl',
            theme.iconWrap
          )}
        >
          {theme.icon}
        </span>
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-semibold',
            theme.badge
          )}
        >
          {theme.label}
        </span>
      </div>

      <div>
        <p
          className={cn(
            'text-base font-semibold leading-snug',
            isExpired ? 'text-gray-500' : 'text-gray-900'
          )}
        >
          {tier.name}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Target{' '}
          <strong className="text-gray-700">
            {target} : {target}
          </strong>{' '}
          pasang poin reward
        </p>
        {tier.reward_type !== 'voucher' && tier.amount > 0 && (
          <p className="mt-1 text-sm font-semibold text-gray-700">
            Rp {tier.amount.toLocaleString('id-ID')}
          </p>
        )}
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
          <span>
            {(tier.progress?.effective_point ?? 0).toLocaleString('id-ID')} /{' '}
            {target}
          </span>
          <span className="font-semibold text-gray-700">{percent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className={cn('h-full rounded-full transition-all', theme.bar)}
            style={{ width: `${Math.max(percent, 2)}%` }}
          />
        </div>
      </div>

      <div className="mt-auto">
        <TierFooter
          tier={tier}
          claiming={claiming}
          disabled={disabled}
          onClaim={onClaim}
          onPrint={onPrint}
          cash={cash}
        />
      </div>
    </div>
  );
}

function TierNote({
  className,
  icon,
  children,
}: {
  className: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs',
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}

// Status reward tunai yang sudah diklaim. Teksnya tidak dikirim API; ditentukan
// dari detail_users.balance (sisa) dan withdrawn_total (sudah ditarik).
// Keduanya level akun, bukan per kartu.
function CashClaimNote({ cash }: { cash: CashInfo }) {
  const { balance, withdrawn } = cash;
  const known = balance !== undefined && withdrawn !== undefined;

  // field belum dikirim backend / masih ada saldo => belum ditarik
  if (!known || balance > 0)
    return (
      <TierNote
        className="bg-amber-50 text-amber-700"
        icon={<PiHourglassBold className="h-4 w-4" />}
      >
        {known
          ? `Reward tunai menunggu pencairan. Saldo reward Anda ${formatRupiah(balance)}.`
          : 'Reward tunai menunggu pencairan oleh admin.'}
      </TierNote>
    );

  if (withdrawn > 0)
    return (
      <TierNote
        className="bg-green-50 text-green-700"
        icon={<PiCheckCircleBold className="h-4 w-4" />}
      >
        Reward tunai sudah dicairkan ({formatRupiah(withdrawn)}).
      </TierNote>
    );

  return (
    <TierNote className="bg-amber-50 text-amber-700">
      Reward tunai sudah diklaim.
    </TierNote>
  );
}

function TierFooter({
  tier,
  claiming,
  disabled,
  onClaim,
  onPrint,
  cash,
}: {
  tier: RewardPasifTier;
  claiming: boolean;
  disabled: boolean;
  onClaim: () => void;
  onPrint: () => void;
  cash: CashInfo;
}) {
  if (tier.can_claim === true)
    return (
      <Button
        size="sm"
        disabled={disabled}
        isLoading={claiming}
        onClick={onClaim}
        className="w-full gap-2 border-0 bg-gradient-to-r from-emerald-500 to-green-500 font-semibold text-white shadow-md hover:brightness-105"
      >
        <PiGiftBold className="h-4 w-4" />
        Klaim Reward
      </Button>
    );

  switch (tier.status) {
    case 'claimed':
      return (
        <div className="space-y-2">
          {tier.voucher_detail?.printable ? (
            <PrintVoucherButton onClick={onPrint} />
          ) : tier.claim_as === 'cash' || tier.reward_type === 'cash' ? (
            <CashClaimNote cash={cash} />
          ) : (
            <TierNote className="bg-amber-50 text-amber-700">
              Voucher sudah diklaim.
            </TierNote>
          )}
          {tier.claimed_at && (
            <p className="text-center text-xs text-gray-500">
              Diklaim {formatDateID(tier.claimed_at)}
            </p>
          )}
        </div>
      );
    case 'expired':
      return (
        <TierNote className="bg-gray-100 text-gray-500">
          Reward hangus
          {tier.expires_at ? ` sejak ${formatDateID(tier.expires_at)}` : ''}.
        </TierNote>
      );
    case 'locked':
      return (
        <TierNote
          className="bg-orange-50 text-orange-700"
          icon={<PiLockBold className="h-4 w-4" />}
        >
          {tier.expires_at
            ? `Upgrade ke Business sebelum ${formatDateID(tier.expires_at)} agar bisa diklaim.`
            : 'Upgrade ke Business untuk membuka reward ini.'}
        </TierNote>
      );
    case 'pending':
      return (
        <TierNote
          className="bg-sky-50 text-sky-700"
          icon={<PiHourglassBold className="h-4 w-4" />}
        >
          Reward sedang diproses.
        </TierNote>
      );
    default:
      return (
        <TierNote
          className="bg-indigo-50 text-indigo-700"
          icon={<PiRocketLaunchBold className="h-4 w-4" />}
        >
          Kurang{' '}
          <strong>
            {(tier.progress?.remaining ?? 0).toLocaleString('id-ID')} pasang
          </strong>{' '}
          lagi. Semangat!
        </TierNote>
      );
  }
}

const formatRupiah = (value?: number) =>
  `Rp ${(value ?? 0).toLocaleString('id-ID')}`;

function SummaryCard({
  title,
  value,
  note,
}: {
  title: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-amber-50 to-white p-5">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-bold text-amber-600">{value}</p>
      {note && <p className="mt-1 text-xs text-gray-500">{note}</p>}
    </div>
  );
}
