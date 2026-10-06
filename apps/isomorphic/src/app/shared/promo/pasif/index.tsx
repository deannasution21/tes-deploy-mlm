'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const IMG_BANNER_PASIF = '/images/produk/PRD0009.png';
import WidgetCard from '@core/components/cards/widget-card';
import { Alert, Button, Text } from 'rizzui';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import {
  PromoMemberPasifData,
  PromoMemberPasifResponse,
  PromoMemberPasifRewardTier,
} from '@/types/promo-member-pasif';
import { UserDataResponse } from '@/types';
import { routes } from '@/config/routes';

// ✅ Backend endpoint klaim (`POST /_promos/action`, action: "claim", type: "member_pasif") sudah siap.
const CLAIM_API_ENABLED = true;

export default function PromoPasifPage({ className }: { className?: string }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);
  const [isClaiming, setClaiming] = useState(false);
  const [isActivating, setActivating] = useState(false);

  const [dataWhole, setDataWhole] = useState<PromoMemberPasifData | null>(
    null
  );

  // Status keanggotaan promo pasif — null selama belum diketahui (masih loading)
  const [isMemberPasifActive, setMemberPasifActive] = useState<
    boolean | null
  >(null);

  // Tanggal aktivasi member pasif (dari GET /_users/:id, membership[type_plan].created_at)
  const [activatedAt, setActivatedAt] = useState<string | null>(null);

  // type_plan member saat ini — aktivasi cuma boleh untuk type_plan "free"
  const [typePlan, setTypePlan] = useState<string | null>(null);

  const formatDateID = (date?: string) => {
    if (!date) return '-';
    // Beberapa response API pakai "YYYY-MM-DD HH:mm" (spasi, bukan ISO "T"),
    // yang parsing-nya tidak konsisten antar browser kalau tidak dinormalisasi dulu.
    return new Date(date.replace(' ', 'T')).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getDataPromo = async () => {
    if (!session?.accessToken) return;

    setLoading(true);

    const id = session?.user?.id;
    const token = session.accessToken;

    Promise.all([
      fetchWithAuth<UserDataResponse>(
        `/_users/${id}`,
        { method: 'GET' },
        token
      ),
      fetchWithAuth<PromoMemberPasifResponse>(
        `/_promos?type=member_pasif&username=${id}`,
        { method: 'GET' },
        token
      ),
    ])
      .then(([userData, promoData]) => {
        // API: member_pasif === false artinya SUDAH aktivasi, true artinya BELUM aktivasi
        const attribute = userData?.data?.attribute;
        const belumAktivasi = Boolean(attribute?.member_pasif);
        setMemberPasifActive(!belumAktivasi);
        setTypePlan(attribute?.type_plan ?? null);
        // Tanggal aktivasi diambil dari membership[type_plan].created_at
        setActivatedAt(
          attribute?.membership?.[attribute?.type_plan ?? '']?.created_at ??
            null
        );
        setDataWhole(promoData?.data ?? null);
      })
      .catch((error: any) => {
        console.error(error);
        setMemberPasifActive(null);
        setTypePlan(null);
        setActivatedAt(null);
        setDataWhole(null);
      })
      .finally(() => setLoading(false));
  };

  const doClaim = async (target: PromoMemberPasifRewardTier) => {
    if (!session?.accessToken) return;

    setClaiming(true);

    fetchWithAuth<any>(
      `/_promos/action`,
      {
        method: 'POST',
        body: JSON.stringify({
          action: 'claim',
          type: 'member_pasif',
          tier_id: target.id,
          username: session?.user?.id,
        }),
      },
      session.accessToken
    )
      .then((data: any) => {
        Swal.fire({
          title: 'Klaim Berhasil',
          html:
            data?.message ??
            `Selamat, reward <b>${target.name}</b> berhasil diklaim!`,
          icon: 'success',
          confirmButtonText: 'Tutup',
          showConfirmButton: true,
          confirmButtonColor: '#ca8a04',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: true,
        }).then(() => {
          getDataPromo();
        });
      })
      .catch((error: any) => {
        console.error(error);
        Swal.fire({
          title: 'Klaim Gagal',
          html: error?.message ?? 'Terjadi kesalahan saat mengklaim reward.',
          icon: 'error',
          confirmButtonText: 'Tutup',
          showConfirmButton: true,
          confirmButtonColor: '#ca8a04',
        });
      })
      .finally(() => setClaiming(false));
  };

  const handleClaim = (target: PromoMemberPasifRewardTier) => {
    if (!CLAIM_API_ENABLED) {
      toast.error(
        <Text as="b">Fitur klaim reward belum tersedia saat ini</Text>
      );
      return;
    }

    Swal.fire({
      title: 'Konfirmasi Klaim',
      html: `Klaim reward <b>${target.name}</b> sekarang?`,
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
      if (result.isConfirmed) {
        doClaim(target);
      } else {
        toast.success(<Text as="b">Klaim dibatalkan!</Text>);
      }
    });
  };

  const doActivate = async () => {
    if (!session?.accessToken) return;

    setActivating(true);

    fetchWithAuth<any>(
      `/_network-diagrams`,
      {
        method: 'POST',
        body: JSON.stringify({
          mode: 'upgrade',
          type_plan: 'plan_a',
        }),
      },
      session.accessToken
    )
      .then((data: any) => {
        Swal.fire({
          title: 'Aktivasi Berhasil',
          html:
            data?.message ??
            'Selamat, akun Anda berhasil diaktivasi dari Member Pasif menjadi ID Normal!',
          icon: 'success',
          confirmButtonText: 'Tutup',
          showConfirmButton: true,
          confirmButtonColor: '#ca8a04',
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: true,
        }).then(() => {
          getDataPromo();
        });
      })
      .catch((error: any) => {
        console.error(error);
        Swal.fire({
          title: 'Aktivasi Gagal',
          html: error?.message ?? 'Terjadi kesalahan saat melakukan aktivasi.',
          icon: 'error',
          confirmButtonText: 'Tutup',
          showConfirmButton: true,
          confirmButtonColor: '#ca8a04',
        });
      })
      .finally(() => setActivating(false));
  };

  const handleActivate = () => {
    Swal.fire({
      title: 'Konfirmasi Aktivasi',
      html: 'Lanjutkan aktivasi akun Anda dari Member Pasif menjadi ID Normal (Reguler)?',
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
      if (!result.isConfirmed) {
        toast.success(<Text as="b">Aktivasi dibatalkan!</Text>);
        return;
      }

      doActivate();
    });
  };

  useEffect(() => {
    if (!session?.accessToken) return;

    if (session?.user?.role !== 'member') {
      router.push(routes.unauthorized.index);
      return;
    }

    getDataPromo();
  }, [session?.accessToken]);

  if (isLoading)
    return <p className="py-20 text-center">Sedang memuat data...</p>;

  const accumulatePoint = dataWhole?.progress?.effective_point ?? 0;
  const targets = dataWhole?.reward_tiers ?? [];

  // Aturan dari backend: status === 'claimed' => sudah diklaim.
  const isTierClaimed = (tier: PromoMemberPasifRewardTier) =>
    tier.status === 'claimed';

  // Aturan dari backend: status === 'eligible' DAN can_claim === true => tombol klaim enable.
  const isTierReached = (tier: PromoMemberPasifRewardTier) =>
    tier.status === 'eligible' && tier.can_claim === true;

  // Guard aktivasi: belum aktivasi (member_pasif) DAN type_plan-nya "free".
  const needsActivation = isMemberPasifActive === false && typePlan === 'free';

  return (
    <>
      <div className="@container">
        <div className="grid grid-cols-1 gap-6 3xl:gap-8">
          {/* Banner selalu tampil, apa pun status aktivasinya */}
          <div className="mb-5">
            <div className="mx-auto max-w-3xl">
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                <Image
                  src={IMG_BANNER_PASIF}
                  alt="Promo Pasif Banner"
                  width={800}
                  height={1000}
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          </div>

          {needsActivation && (
            <>
              <Alert variant="flat" color="danger">
                <Text className="font-semibold">
                  Anda Belum Aktivasi sebagai Member Pasif
                </Text>
                <Text className="mt-1 break-normal">
                  Untuk dapat mengikuti Promo Pasif, Anda harus melakukan
                  aktivasi akun terlebih dahulu dari Member Pasif menjadi ID
                  Normal.
                </Text>
                <Button
                  className="mt-3"
                  isLoading={isActivating}
                  disabled={isActivating}
                  onClick={handleActivate}
                >
                  Aktivasi
                </Button>
              </Alert>

              <Alert variant="flat" color="info">
                <Text className="font-semibold">
                  Informasi Upgrade Member Pasif
                </Text>
                <Text className="mt-1 break-normal">
                  Member berstatus <strong>Pasif</strong> yang ingin upgrade
                  menjadi <strong>Member Aktif</strong> wajib menggunakan{' '}
                  <strong>PIN Reguler</strong>. Pastikan Anda sudah memiliki
                  PIN Reguler yang masih valid sebelum melakukan aktivasi.
                </Text>
                <Text className="mt-1 break-normal">
                  Catatan: PIN dari jenis plan lain tidak dapat digunakan
                  untuk proses upgrade Member Pasif ini.
                </Text>
              </Alert>
            </>
          )}

          {!needsActivation && (
            <>
              {activatedAt && (
                <Alert variant="flat" color="success">
                  <Text className="break-normal">
                    Akun Anda aktif sebagai ID Normal sejak{' '}
                    <strong>{formatDateID(activatedAt)}</strong>.
                  </Text>
                </Alert>
              )}

              <WidgetCard
                title={
                  <span className="text-[#c69731]">
                    {dataWhole?.promo_name ?? 'Promo Member Pasif'}
                  </span>
                }
                titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
              >
                <p className="mb-5">
                  {dataWhole?.note ??
                    'Program Promo Member Pasif memberikan kesempatan bagi member untuk mengumpulkan point pasif dan menukarkannya dengan berbagai reward.'}
                </p>

                {dataWhole?.period && (
                  <p className="mb-5">
                    Periode: {formatDateID(dataWhole?.period?.start_date)} sd{' '}
                    {formatDateID(dataWhole?.period?.end_date)}
                  </p>
                )}

                <p className="mb-5">Rewards:</p>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {targets.map((target) => {
                    const isReached = isTierReached(target);
                    const isClaimed = isTierClaimed(target);

                    return (
                      <div
                        key={target.id}
                        className="flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="bg-gradient-to-r from-blue-500 to-teal-400 px-4 py-3">
                          <h3 className="text-sm font-semibold leading-tight text-white">
                            {target.name}
                          </h3>
                        </div>

                        <div className="flex flex-1 flex-col justify-between p-4">
                          <div className="space-y-2">
                            <p className="text-xl font-bold text-gray-800">
                              {target.point_required.toLocaleString('id-ID')}{' '}
                              Point Pasif
                            </p>
                            <p className="text-xs text-gray-500">
                              Progress: {target.progress?.effective_point ?? 0}{' '}
                              / {target.point_required.toLocaleString('id-ID')}{' '}
                              ({target.progress?.percent ?? 0}%)
                            </p>
                          </div>

                          <div className="my-3 border-t"></div>

                          <Button
                            size="sm"
                            disabled={
                              !isReached ||
                              isClaimed ||
                              isClaiming ||
                              !CLAIM_API_ENABLED
                            }
                            isLoading={isClaiming}
                            onClick={() => handleClaim(target)}
                          >
                            {isClaimed
                              ? 'Sudah Diklaim'
                              : !isReached
                                ? 'Belum Tercapai'
                                : CLAIM_API_ENABLED
                                  ? 'Klaim Reward'
                                  : 'Klaim (Segera Hadir)'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </WidgetCard>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-amber-50 to-white p-5">
                  <p className="text-sm font-medium text-gray-500">
                    Total Point Pasif Terkumpul
                  </p>
                  <p className="mt-1 text-3xl font-bold text-amber-600">
                    {accumulatePoint.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
