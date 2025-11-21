'use client';

import cn from '@core/utils/class-names';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('../pdf-viewer'), { ssr: false });

export default function ProfilPerusahaanPage({
  className,
}: {
  className?: string;
}) {
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
            <div className="mx-auto w-full max-w-full">
              <PdfViewer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
