'use client';

import cn from '@core/utils/class-names';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import imgTripThailand from '@public/assets/img/promo-stockist-ipg-thailand.jpg';
import imgMobilJan from '@public/assets/img/promo-mobil-januari-2026.jpeg';
import imgTripVietnam from '@public/assets/img/promo-vietnam-januari-2026.jpeg';
import imgStockistAkumulasi from '@public/assets/img/promo-stockist-akumulasi.jpg';
import imgTemplate from '@public/assets/img/logo/logo-diagram-jaringan.jpeg';
import dynamic from 'next/dynamic';

const Slider = dynamic(() => import('react-slick'), {
  ssr: false,
});

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { routes } from '@/config/routes';

export default function PromoPage({ className }: { className?: string }) {
  const { data: session } = useSession();

  const [isLoading, setLoading] = useState(true);
  const [isLoadingS, setLoadingS] = useState(false);

  const gambarPromo = [
    {
      id: 1,
      role: 'stockist',
      src: imgStockistAkumulasi,
      url: routes.promo.rewardStockist,
    },
    {
      id: 2,
      role: 'all',
      src: imgTripThailand,
      url: routes.promo.tahunan,
    },
    {
      id: 3,
      role: 'all',
      src: imgMobilJan,
      url: routes.promo.tahunan,
    },
    {
      id: 4,
      role: 'all',
      src: imgTripVietnam,
      url: routes.promo.tahunan,
    },
    {
      id: 5,
      role: 'stockist',
      src: imgTemplate,
      url: routes.promo.umroh2026Stockist,
    },
  ];

  const userRole = session?.user?.role; // 'stockist' | 'user'

  const filteredPromo = gambarPromo.filter((promo) => {
    if (promo.role === 'all') return true;
    return promo.role === userRole;
  });

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
                  padding-bottom: 50px;
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
                {filteredPromo.map((v, i) => (
                  <div key={v.id} className="px-2">
                    <div className="relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-lg">
                      {/* IMAGE */}
                      <Image
                        src={v.src}
                        alt="Promo Banner"
                        width={800}
                        height={1000}
                        priority={i === 0}
                        className="h-auto w-full object-contain"
                      />

                      {/* CTA */}
                      <div className="p-4">
                        <a
                          href={v.url}
                          className="block w-full rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-primary/90"
                        >
                          Lihat Promo
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
