'use client';

import cn from '@core/utils/class-names';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import imgTemplate from '@public/assets/img/logo/logo-diagram-jaringan.jpeg';
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

export default function PromoUmroh2026StockistPage({
  className,
}: {
  className?: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);
  const [isLoadingS, setLoadingS] = useState(false);

  const formatDateID = (date?: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

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

  const getDataPromo = async () => {
    if (!session?.accessToken) return;

    setLoadingS(true);

    const id = session?.user?.id;

    fetchWithAuth<PromoStatusResponse>(
      `/_promos?username=${id}&role=stockist`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        const promos = data?.data?.promos ?? [];

        const filteredPromo = promos.find(
          (promo) =>
            promo?.meta?.promo_config_id === 'PROMO#STOCKIST_SPEKTAKULER_2026'
        );

        setDataWhole(filteredPromo ?? null);
      })
      .catch((error) => {
        console.error(error);
        setDataWhole(null);
      })
      .finally(() => setLoadingS(false));
  };

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    if (session?.user?.role !== 'stockist') {
      router.push(routes.unauthorized.index);
    } else {
      getDataPromo();
    }

    setLoading(false);
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

              <Slider {...settings}>
                {gambarPromo?.map((v, i) => (
                  <div key={i} className="px-2">
                    <div className="relative overflow-hidden rounded-xl shadow-lg">
                      <Image
                        src={v.src}
                        alt="Promo Banner"
                        width={800}
                        height={1000}
                        priority={i === 0}
                        className="h-auto w-full object-contain"
                      />
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          <div>
            <WidgetCard
              title={
                <span className="text-[#c69731]">
                  {dataWhole?.progress_raw?.promo_snapshot?.name}
                </span>
              }
              titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
            >
              <p className="mb-5">
                {dataWhole?.progress_raw?.promo_snapshot?.description}
              </p>

              <p className="mb-5">
                Periode:{' '}
                {formatDateID(
                  dataWhole?.progress_raw?.channels?.pin?.period_start
                )}{' '}
                sd{' '}
                {formatDateID(
                  dataWhole?.progress_raw?.channels?.pin?.period_end
                )}
              </p>

              {/* HIGHLIGHT STATS */}
              {(() => {
                const pinStats = dataWhole?.progress_raw?.channels?.pin?.stats;

                if (!pinStats) return null;

                return (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* ORDER COUNT */}
                    {/* <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-5">
                      <p className="text-sm font-medium text-gray-500">
                        Total Order Dihitung
                      </p>
                      <p className="mt-1 text-3xl font-bold text-blue-600">
                        {pinStats.order_count}
                      </p>
                    </div> */}

                    {/* PIN COUNTED */}
                    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-amber-50 to-white p-5">
                      <p className="text-sm font-medium text-gray-500">
                        Total PIN Terkumpul
                      </p>
                      <p className="mt-1 text-3xl font-bold text-amber-600">
                        {pinStats.pin_counted.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* TARGETS TABLE */}
              {(() => {
                const targets =
                  dataWhole?.progress_raw?.promo_snapshot?.targets ?? [];

                if (targets.length === 0) return null;

                return (
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full rounded-lg border border-gray-200 text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">
                            Target PIN
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">
                            Reward
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-gray-700">
                            Withdraw Reward
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {targets.map((target, index) => (
                          <tr
                            key={index}
                            className="border-t border-gray-200 hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 font-medium text-gray-800">
                              {target.accumulate_pin.toLocaleString('id-ID')}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              {target.reward}
                            </td>
                            <td className="px-4 py-3">
                              <Button disabled>Withdraw Sekarang</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </WidgetCard>
          </div>
        </div>
      </div>
    </>
  );
}
