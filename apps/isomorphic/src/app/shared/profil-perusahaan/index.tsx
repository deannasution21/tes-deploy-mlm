'use client';

import cn from '@core/utils/class-names';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';

export default function ProfilPerusahaanPage({
  className,
}: {
  className?: string;
}) {
  const { data: session } = useSession();

  const [isLoading, setLoading] = useState(true);

  const images = [
    '/pdf/profil-perusahaan-ipg/profil-perusahaan-ipg-1-min.png',
    '/pdf/profil-perusahaan-ipg/profil-perusahaan-ipg-2-min.png',
    '/pdf/profil-perusahaan-ipg/profil-perusahaan-ipg-3-min.png',
    '/pdf/profil-perusahaan-ipg/profil-perusahaan-ipg-4-min.png',
    '/pdf/profil-perusahaan-ipg/profil-perusahaan-ipg-5-min.png',
    '/pdf/profil-perusahaan-ipg/profil-perusahaan-ipg-6-min.png',
    '/pdf/profil-perusahaan-ipg/profil-perusahaan-ipg-7-min.png',
  ];

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
          <div className="bg-gray-50 p-4 sm:p-6">
            <div className="mx-auto flex max-w-sm flex-col gap-3 md:max-w-2xl lg:max-w-3xl">
              {images?.map((v, i) => (
                <div className="relative mx-auto w-full">
                  <Image
                    src={v}
                    alt=""
                    width={800}
                    height={800}
                    className="rounded-lg object-contain shadow-md"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
