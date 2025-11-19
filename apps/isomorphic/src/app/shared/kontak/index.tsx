'use client';

import cn from '@core/utils/class-names';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import pageImg from '@public/assets/img/update-info-wa-terbaru.jpg';

export default function KontakPage({ className }: { className?: string }) {
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
              <div className="relative mx-auto aspect-square">
                <Image
                  src={pageImg}
                  alt=""
                  fill
                  priority
                  className="overflow-hidden rounded-lg object-contain shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
