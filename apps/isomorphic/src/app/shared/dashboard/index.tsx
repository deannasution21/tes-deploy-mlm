'use client';
import Link from 'next/link';
import Image from 'next/image';
import { routes } from '@/config/routes';
import { Button, Text } from 'rizzui';
import WelcomeBanner from '@core/components/banners/welcome';
import { PiShoppingCart } from 'react-icons/pi';
import welcomeImg from '@public/shop-illustration.png';
import HandWaveIcon from '@core/components/icons/hand-wave';
import FleetStatus from './fleet-status';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Pin, PinResponse } from '@/types';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

export default function Dashboard() {
  const { data: session } = useSession();

  const [dataPins, setDataPins] = useState<number>(0);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<PinResponse>(
      `/_pins/dealer/${session.user?.id}?fetch=all&type=plan_a&status=active`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setDataPins(data.data.count);
      })
      .catch((error) => {
        console.error(error);
        setDataPins(0);
      })
      .finally(() => setLoading(false));
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
          contentClassName="@2xl:max-w-[calc(100%-340px)]"
          className="border border-muted bg-gray-0 pb-8 @4xl:col-span-2 @7xl:col-span-8 @7xl:min-h-[412px] dark:bg-gray-100/30 lg:pb-9"
        >
          {session?.user?.role === 'stockist' && (
            <Link href={routes.produk.index} className="inline-flex">
              <Button as="span" className="h-[38px] shadow md:h-10">
                <PiShoppingCart className="me-1 h-4 w-4" /> Beli Produk
              </Button>
            </Link>
          )}
        </WelcomeBanner>

        <FleetStatus
          pins={dataPins}
          className="h-[464px] @sm:h-[520px] @7xl:col-span-4 @7xl:col-start-9 @7xl:row-start-1 @7xl:row-end-3 @7xl:h-full"
        />
      </div>
    </div>
  );
}
