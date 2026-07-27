'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import defaultPlaceholder from '@public/assets/img/logo/logo-ipg3.jpeg';

const IMG_BANNER_PASIF = '/images/produk/PRD0009.png';
import WidgetCard from '@core/components/cards/widget-card';
import { Alert, Button, Text, Title } from 'rizzui';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import {
  PromoMemberPasifData,
  PromoMemberPasifResponse,
  PromoMemberPasifRewardTier,
} from '@/types/promo-member-pasif';
import { ProductItem, ProductResponse, UserDataResponse } from '@/types';
import { routes } from '@/config/routes';
import { useCart } from '@/store/quick-cart/cart.context';
import { generateCartProduct } from '@/store/quick-cart/generate-cart-product';

// 🚧 Backend endpoint klaim (`POST /_promos/action`) belum siap di sisi server.
// Set true kembali begitu backend sudah support action "claim" untuk type "member_pasif".
const CLAIM_API_ENABLED = false;

export default function PromoPasifPage({ className }: { className?: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { addItemToCart, resetCart } = useCart();

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

  // Produk aktivasi member pasif (dari GET /_products, difilter attribute.visible_for_member_pasif)
  const [activationProducts, setActivationProducts] = useState<ProductItem[]>(
    []
  );

  const formatDateID = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
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
        const belumAktivasi = Boolean(
          userData?.data?.attribute?.member_pasif
        );
        setMemberPasifActive(!belumAktivasi);
        setDataWhole(promoData?.data ?? null);

        // Produk aktivasi cuma relevan (dan cuma perlu di-fetch) kalau member
        // belum aktivasi — kalau sudah aktivasi, tidak perlu panggil /_products sama sekali.
        if (!belumAktivasi) {
          setActivationProducts([]);
          return;
        }

        return fetchWithAuth<ProductResponse>(
          `/_products`,
          { method: 'GET' },
          token
        ).then((productData) => {
          const products = productData?.data?.products ?? [];
          setActivationProducts(
            products.filter((p) => p?.attribute?.visible_for_member_pasif)
          );
        });
      })
      .catch((error: any) => {
        console.error(error);
        setMemberPasifActive(null);
        setDataWhole(null);
        setActivationProducts([]);
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
      .then(() => {
        Swal.fire({
          title: 'Klaim Berhasil',
          html: `Selamat, reward <b>${target.name}</b> berhasil diklaim!`,
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
      .catch((error) => {
        toast.error(<Text as="b">Klaim Reward Gagal</Text>);
        console.error(error);
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

  const handleActivate = (product: ProductItem) => {
    Swal.fire({
      title: 'Konfirmasi Aktivasi',
      html: `Lanjutkan pembelian <b>${product.attribute?.name}</b> senilai <b>${product.attribute?.price?.currency}</b> untuk mengaktifkan status Member Pasif Anda?`,
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

      setActivating(true);

      const cartItem = generateCartProduct({
        ...product,
        quantity: 1,
      });

      // pastikan cart hanya berisi produk aktivasi ini
      resetCart();
      addItemToCart(cartItem, 1);

      router.push(routes.promo.pasif.checkout);
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
  const achievedRewards = dataWhole?.achieved_rewards ?? [];
  const targets = dataWhole?.reward_tiers ?? [];

  const isTierClaimed = (tier: PromoMemberPasifRewardTier) => {
    if (tier.status === 'claimed') return true;

    return achievedRewards.some((r: any) => {
      if (typeof r === 'string') return r === tier.id;
      return r?.id === tier.id || r?.tier_id === tier.id;
    });
  };

  const isTierReached = (tier: PromoMemberPasifRewardTier) => {
    return Boolean(tier.can_claim);
  };

  const getProductImage = (product: ProductItem) => {
    // product.image berupa path lokal di folder public (mis. /images/produk/PRD0009.png)
    if (!product.image) return defaultPlaceholder;
    return product.image;
  };

  return (
    <>
      <div className="@container">
        <div className="grid grid-cols-1 gap-6 3xl:gap-8">
          {isMemberPasifActive === false && (
            <>
              <Alert variant="flat" color="danger">
                <Text className="font-semibold">
                  Anda Belum Aktivasi sebagai Member Pasif
                </Text>
                <Text className="mt-1 break-normal">
                  Untuk dapat mengikuti Promo Pasif, Anda harus melakukan
                  aktivasi terlebih dahulu dengan membeli produk aktivasi di
                  bawah ini.
                </Text>
              </Alert>

              {activationProducts.length > 0 && (
                <div className="flex flex-wrap justify-center gap-8">
                  {activationProducts.map((product) => (
                    <div
                      key={product.product_id}
                      className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:max-w-lg"
                    >
                      <div className="relative mx-auto w-full overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          alt={product.attribute?.name ?? 'Produk'}
                          src={getProductImage(product)}
                          width={800}
                          height={1000}
                          sizes="(max-width: 768px) 100vw, 512px"
                          className="h-auto w-full object-contain"
                        />
                      </div>

                      <div className="pt-3 text-center">
                        <Title as="h6" className="mb-1 font-semibold">
                          {product.attribute?.name}
                        </Title>

                        <Text as="p">{product.attribute?.description}</Text>

                        <div className="mt-2 flex items-center justify-center text-lg font-semibold text-gray-900">
                          {product.attribute?.price?.currency ??
                            `Rp ${product.attribute?.price?.amount?.toLocaleString('id-ID')}`}
                        </div>

                        <Button
                          className="mt-4 w-full"
                          isLoading={isActivating}
                          disabled={isActivating}
                          onClick={() => handleActivate(product)}
                        >
                          Aktivasi Sekarang
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {isMemberPasifActive !== false && (
            <>
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
