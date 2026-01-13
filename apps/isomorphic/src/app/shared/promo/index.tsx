'use client';

import cn from '@core/utils/class-names';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import pageImg from '@public/assets/img/promo-stockist-ipg-thailand.jpg';
import pageImg1 from '@public/assets/img/promo-mobil-januari-2026.jpeg';
import pageImg2 from '@public/assets/img/promo-vietnam-januari-2026.jpeg';

export default function PromoPage({ className }: { className?: string }) {
  const { data: session } = useSession();

  const [isLoading, setLoading] = useState(true);

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
          <div className="">
            <div className="mx-auto max-w-sm md:max-w-xl lg:max-w-2xl">
              <div className="flex flex-col gap-4">
                <Image
                  src={pageImg}
                  alt=""
                  width={800}
                  height={600}
                  priority
                  className="h-auto w-full rounded-lg object-contain shadow-md"
                />

                <Image
                  src={pageImg1}
                  alt=""
                  width={800}
                  height={600}
                  priority
                  className="h-auto w-full rounded-lg object-contain shadow-md"
                />

                <Image
                  src={pageImg2}
                  alt=""
                  width={800}
                  height={600}
                  priority
                  className="h-auto w-full rounded-lg object-contain shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
