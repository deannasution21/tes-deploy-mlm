'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Alert, Badge, Button, Text } from 'rizzui';
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
} from '@/types/reward-pasif';

const TIER_STATUS: Record<
  RewardTierStatus,
  {
    label: string;
    color: 'success' | 'warning' | 'danger' | 'info' | 'secondary';
  }
> = {
  not_reached: { label: 'Belum Tercapai', color: 'secondary' },
  pending: { label: 'Menunggu', color: 'info' },
  locked: { label: 'Terkunci', color: 'warning' },
  eligible: { label: 'Bisa Diklaim', color: 'success' },
  claimed: { label: 'Sudah Diklaim', color: 'info' },
  expired: { label: 'Hangus', color: 'danger' },
};

const formatDateID = (date?: string | null) => {
  if (!date) return '-';
  return new Date(date.replace(' ', 'T')).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export default function RewardPasifPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [data, setData] = useState<RewardPasifData | null>(null);

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
          type: 'claim_reward',
          tier_id: tier.id,
          type_plan: 'free',
        }),
      },
      session.accessToken
    )
      .then((res) => {
        Swal.fire({
          title: 'Klaim Berhasil',
          html: `${res?.message ?? `Reward <b>${tier.name}</b> berhasil diklaim.`}<br/><br/>Reward diklaim, menunggu pencairan oleh admin.`,
          icon: 'success',
          confirmButtonText: 'Tutup',
          confirmButtonColor: '#ca8a04',
        }).then(() => getData());
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

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <Alert variant="flat" color="info">
          <Text className="font-semibold">Informasi</Text>
          <ol className="list-disc ps-5">
            <li>
              <Text className="break-normal">
                Reward dihitung dari poin pasif (pasangan kiri &amp; kanan).
              </Text>
            </li>
            <li>
              <Text className="break-normal">
                Reward yang sudah diklaim akan diproses dan menunggu pencairan
                oleh admin.
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

        {!user?.can_claim_reward && (
          <Alert variant="flat" color="warning">
            <Text className="break-normal">
              Akun Anda saat ini belum dapat mengklaim reward.
            </Text>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            title="Poin Pasif Efektif"
            value={(user?.effective_point ?? 0).toLocaleString('id-ID')}
          />
          <SummaryCard
            title="Poin Pasif Kiri / Kanan"
            value={`${(user?.point_pasif_left ?? 0).toLocaleString('id-ID')} / ${(user?.point_pasif_right ?? 0).toLocaleString('id-ID')}`}
          />
          <SummaryCard
            title="Total Reward Diklaim"
            value={`Rp ${(user?.claimed_total ?? 0).toLocaleString('id-ID')}`}
          />
        </div>

        <WidgetCard
          title={<span className="text-[#c69731]">Daftar Reward</span>}
          titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => {
              const status = TIER_STATUS[tier.status] ?? {
                label: tier.status,
                color: 'secondary' as const,
              };

              return (
                <div
                  key={tier.id}
                  className="flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-teal-400 px-4 py-3">
                    <h3 className="text-sm font-semibold leading-tight text-white">
                      {tier.name}
                    </h3>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div className="space-y-2">
                      <Badge variant="flat" color={status.color} size="sm">
                        {status.label}
                      </Badge>
                      <p className="text-xl font-bold text-gray-800">
                        {tier.point_required.toLocaleString('id-ID')} Poin Pasif
                      </p>
                      {tier.amount > 0 && (
                        <p className="text-sm text-gray-600">
                          Rp {tier.amount.toLocaleString('id-ID')}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Progress: {tier.progress?.effective_point ?? 0} /{' '}
                        {tier.point_required.toLocaleString('id-ID')} (
                        {tier.progress?.percent ?? 0}%)
                      </p>
                      {tier.expires_at && tier.status !== 'claimed' && (
                        <p className="text-xs text-gray-500">
                          {tier.status === 'expired'
                            ? 'Hangus sejak'
                            : 'Berlaku sampai'}{' '}
                          {formatDateID(tier.expires_at)}
                        </p>
                      )}
                    </div>

                    <div className="my-3 border-t"></div>

                    <Button
                      size="sm"
                      disabled={tier.can_claim !== true || !!claimingId}
                      isLoading={claimingId === tier.id}
                      onClick={() => handleClaim(tier)}
                    >
                      {tier.can_claim === true ? 'Klaim Reward' : status.label}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-amber-50 to-white p-5">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-bold text-amber-600">{value}</p>
    </div>
  );
}
