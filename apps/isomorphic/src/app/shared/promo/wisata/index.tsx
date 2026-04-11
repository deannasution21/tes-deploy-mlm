'use client';

import cn from '@core/utils/class-names';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import imgTemplate from '@public/assets/img/promo-wisata-april-2026.jpg';
import WidgetCard from '@core/components/cards/widget-card';
import { Alert, Button, Input, Text } from 'rizzui';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

const Slider = dynamic(() => import('react-slick'), {
  ssr: false,
});

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { routes } from '@/config/routes';
import { useRouter } from 'next/navigation';
import {
  PromoStatusData,
  PromoStatusResponse,
} from '@/types/promo-reward-stockist';
import DateCell from '@core/ui/date-cell';
import {
  PointPromoWisataData,
  PointPromoWisataResponse,
  PromoWisataRewardData,
  PromoWisataRewardResponse,
} from '@/types/promo';
import HistoryTransferPointWisataTable from '../../tables/history-transfer-point-wisata';

export default function PromoWisataPage({ className }: { className?: string }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);

  const formatDateID = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const [dataPoint, setDataPoint] = useState<PointPromoWisataData | number>(0);
  const [dataRewards, setDataRewards] = useState<PromoWisataRewardData | null>(
    null
  );
  const [dataWhole, setDataWhole] = useState<PromoStatusData | null>(null);

  const gambarPromo = [imgTemplate];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,

    // 👇 MOBILE FIRST
    slidesToShow: 2,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '24px',

    responsive: [
      {
        breakpoint: 1024, // tablet & up
        settings: {
          slidesToShow: 2,
          centerMode: false,
        },
      },
      {
        breakpoint: 1280, // desktop
        settings: {
          slidesToShow: 3,
          centerMode: false,
        },
      },
    ],
  };

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    Promise.all([
      fetchWithAuth<PointPromoWisataResponse>(
        `/_point-promo-wisata`,
        { method: 'GET' },
        session.accessToken
      ),
      fetchWithAuth<PromoWisataRewardResponse>(
        `/_point-promo-wisata/rewards`,
        { method: 'GET' },
        session.accessToken
      ),
    ])
      .then(([pinData, rewardsData]) => {
        setDataPoint(pinData?.data?.point_promo_wisata);
        setDataRewards(rewardsData?.data);
      })
      .catch((error) => {
        console.error(error);
        setDataPoint(0);
        setDataRewards(null);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  if (isLoading)
    return <p className="py-20 text-center">Sedang memuat data...</p>;

  return (
    <>
      <div className="@container">
        <div className="grid grid-cols-1 gap-6 3xl:gap-8">
          <div className="mb-5">
            <div className="mx-auto max-w-3xl">
              <style jsx global>{`
                /* Make slick work nicely with flex */
                .slick-track {
                  display: flex !important;
                  /* align-items: stretch; */
                  align-items: center;
                }

                .slick-slide {
                  height: auto;
                  display: flex !important;
                  justify-content: center;
                }

                .slick-slide > div {
                  height: 100%;
                  width: 100%;
                }

                /* Default state (non-active slides) */
                .slick-slide img {
                  transition: all 0.3s ease;
                }

                /* Mobile focus UX */
                @media (max-width: 768px) {
                  .slick-slide {
                    opacity: 0.35;
                    transform: scale(0.92);
                    transition: all 0.3s ease;
                  }

                  .slick-active {
                    opacity: 1;
                    transform: scale(1);
                  }

                  .slick-active img {
                    transform: scale(1.02);
                  }
                }

                /* Desktop subtle emphasis (optional) */
                @media (min-width: 769px) {
                  .slick-center img {
                    transform: scale(1.03);
                  }
                }
              `}</style>

              <div className="relative overflow-hidden rounded-xl shadow-lg">
                <Image
                  src={imgTemplate.src}
                  alt="Promo Banner"
                  width={800}
                  height={1000}
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 3xl:gap-8">
            <WidgetCard
              title={
                <span className="text-[#c69731]">
                  Promo Paket Wisata 2026 IPG
                </span>
              }
              titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
            >
              <p className="mb-5">
                Program Paket Wisata dari IPG adalah kesempatan spesial bagi
                para stockist untuk mengumpulkan poin dan menukarkannya dengan
                berbagai reward perjalanan impian.
              </p>

              <p className="mb-5">
                Dengan setiap pembelian paket senilai Rp750.000, kamu akan
                mendapatkan:
                <ol>
                  <li>✅ 2 Paket Produk</li>
                  <li>✅ 1 PIN Aktivasi</li>
                  <li>✅ 1 Poin Wisata</li>
                </ol>
              </p>

              <p className="mb-5">
                Semakin banyak pembelian yang kamu lakukan, semakin besar poin
                yang terkumpul, dan semakin dekat kamu dengan berbagai destinasi
                eksklusif!
              </p>

              <p className="mb-5">
                Periode: {formatDateID(dataRewards?.period?.start_date)} sd{' '}
                {formatDateID(dataRewards?.period?.end_date)}
              </p>

              <p className="mb-5">Rewards:</p>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {dataRewards?.rewards?.map((reward) => (
                  <div
                    key={reward.id}
                    className="flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-teal-400 px-4 py-3">
                      <h3 className="text-sm font-semibold leading-tight text-white">
                        {reward.name}
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div className="space-y-2">
                        <p className="text-xl font-bold text-gray-800">
                          {reward.point_promo_wisata} Poin
                        </p>

                        {reward.note && (
                          <p className="text-xs leading-relaxed text-gray-500">
                            {reward.note}
                          </p>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="my-3 border-t"></div>

                      {/* Footer */}
                      <div className="text-xs text-gray-600">
                        <p className="mb-1 font-medium text-gray-700">
                          Periode
                        </p>
                        <p className="leading-tight">
                          {formatDateID(reward.start_date)} <br />
                          <span className="text-gray-400">s/d</span>{' '}
                          {formatDateID(reward.end_date)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </WidgetCard>

            <HistoryTransferPointWisataTable typenya="received" />
          </div>
        </div>
      </div>
    </>
  );
}
