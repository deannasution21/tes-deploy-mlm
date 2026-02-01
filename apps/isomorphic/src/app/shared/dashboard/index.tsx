'use client';
import Link from 'next/link';
import Image from 'next/image';
import { routes } from '@/config/routes';
import { Button, Text } from 'rizzui';
import WelcomeBanner from '@core/components/banners/welcome';
import { PiNotepad, PiShoppingCart } from 'react-icons/pi';
import welcomeImg from '@public/shop-illustration.png';
import HandWaveIcon from '@core/components/icons/hand-wave';
import FleetStatus from './fleet-status';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { DealerSummaryData, DealerSummaryResponse } from '@/types';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { handleSessionExpired } from '@/utils/sessionHandler';
import imgRugiWaktu from '@public/assets/img/rugi-waktu.jpg';

export default function DashboardPage() {
  const { data: session } = useSession();

  const [dataPins, setDataPins] = useState<DealerSummaryData | null>(null);
  const [isLoading, setLoading] = useState(false);

  const fetchDataPin = async () => {
    if (!session?.accessToken) {
      handleSessionExpired;
      return;
    }

    setLoading(true);

    fetchWithAuth<DealerSummaryResponse>(
      `/_pins/dealer/${session.user?.id}?fetch=summary&status=active`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setDataPins(data.data);
      })
      .catch((error) => {
        console.error(error);
        setDataPins(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (
      session?.user?.role !== 'admin' &&
      session?.user?.role !== 'admin_stock' &&
      session?.user?.role !== 'admin_member'
    ) {
      fetchDataPin();
    }
  }, [session?.accessToken]);

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p>Sedang memuat data...</p>
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="mx-auto max-w-xl">
        {session?.user?.role === 'stockist' && (
          <div className="relative mb-5 flex h-full flex-col overflow-hidden rounded-xl shadow-lg">
            {/* IMAGE */}
            <Image
              src={imgRugiWaktu.src}
              alt="Promo Banner"
              width={800}
              height={1000}
              className="h-auto w-full object-contain"
            />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 items-stretch gap-6 @4xl:grid-cols-2 @7xl:grid-cols-12 3xl:gap-8">
        <WelcomeBanner
          title={
            <>
              Selamat Datang di Dashboard, <br />{' '}
              {session?.user?.name ?? 'Pengguna'}{' '}
              <p className="inline-block uppercase text-primary">
                (@{session?.user?.id ?? '-'})
              </p>{' '}
              <HandWaveIcon className="inline-flex h-8 w-8" />
            </>
          }
          description={
            'Mulailah perjalanan menuju kesuksesan bersama Infinite Prestige Global!'
          }
          media={
            <div className="absolute -bottom-6 end-4 hidden w-[300px] @2xl:block lg:w-[320px] 2xl:-bottom-7 2xl:w-[330px]">
              <div className="relative">
                <Image
                  src={welcomeImg}
                  alt="Welcome shop image form freepik"
                  className="dark:brightness-95 dark:drop-shadow-md"
                />
              </div>
            </div>
          }
          contentClassName={
            session?.user?.role === 'admin_stock'
              ? 'w-full'
              : '@2xl:max-w-[calc(100%-340px)]'
          }
          className={`border border-muted bg-gray-0 pb-8 @4xl:col-span-2 ${session?.user?.role === 'admin_stock' ? '@7xl:col-span-full' : '@7xl:col-span-8'} @7xl:min-h-[412px] dark:bg-gray-100/30 lg:pb-9`}
        >
          {session?.user?.role === 'stockist' ||
            (session?.user?.role === 'admin_stock' && (
              <div className="flex gap-2">
                <Link href={routes.produk.index} className="inline-flex">
                  <Button as="span" className="h-[38px] shadow md:h-10">
                    <PiShoppingCart className="me-1 h-4 w-4" /> Beli Produk
                  </Button>
                </Link>
                {(session?.user?.id === 'adminstock' ||
                  session?.user?.id === 'admin_stock' ||
                  session?.user?.id === 'adminpin2026') && (
                  <Link
                    href={routes.produk.pesananStockist.index}
                    className="inline-flex"
                  >
                    <Button
                      as="span"
                      className="h-[38px] bg-blue-500 shadow hover:bg-blue-700 md:h-10"
                    >
                      <PiNotepad className="me-1 h-4 w-4" /> History Pembelian
                      Stockist
                    </Button>
                  </Link>
                )}
              </div>
            ))}
        </WelcomeBanner>

        {dataPins && (
          <FleetStatus
            pins={dataPins}
            className="h-[464px] @sm:h-[520px] @7xl:col-span-4 @7xl:col-start-9 @7xl:row-start-1 @7xl:row-end-3 @7xl:h-full"
          />
        )}
      </div>
    </div>
  );
}
