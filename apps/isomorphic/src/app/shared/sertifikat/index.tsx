'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import pageImgThumbnail from '@public/assets/img/sertifikat-feb.jpg';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { ReportData, ReportResponse } from '@/types/sertifikat';
import { useReactToPrint } from 'react-to-print';
import { createPortal } from 'react-dom';
import { Button } from 'rizzui';
import { PiPrinter } from 'react-icons/pi';

export default function SertifikatPage({ className }: { className?: string }) {
  const { data: session } = useSession();

  const [dataSertifikat, setDataSertifikat] = useState<ReportData | null>(null);
  const [isLoading, setLoading] = useState(true);

  const printRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: printRef, // ✅ new type-safe property
    documentTitle: `Sertifikat IPG `,
    onAfterPrint: () => {
      setIsPrinting(false); // printing finished
    },
  });

  const startPrint = (username?: string) => {
    setIsPrinting(true);
    document.title = `Sertifikat IPG ${username?.toLocaleUpperCase()}`;
    handlePrint();
  };

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<ReportResponse>(
      `/_reports/documents?type=certificate&username=${session?.user?.id}`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setDataSertifikat(data?.data ?? null);
      })
      .catch((error) => {
        console.error(error);
        setDataSertifikat(null);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    setLoading(false);
  }, [session?.accessToken]);

  if (isLoading)
    return <p className="py-20 text-center">Sedang memuat data...</p>;

  if (!dataSertifikat)
    return (
      <p className="py-20 text-center">
        Tidak ada data sertifikat untuk pengguna ini
      </p>
    );

  return (
    <>
      {isPrinting &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
            <div className="rounded-lg bg-white p-4 text-center shadow-lg">
              <p className="font-medium text-gray-700">
                Menyiapkan cetakan Sertifikat...
              </p>
            </div>
          </div>,
          document.body
        )}

      <div className="@container">
        <div className="grid grid-cols-1 gap-6 3xl:gap-8">
          <div className="">
            <div className="mx-auto max-w-lg md:max-w-2xl lg:max-w-3xl">
              {/* <div className="relative mx-auto aspect-square">
                <Image
                  src={pageImg}
                  alt=""
                  fill
                  priority
                  className="overflow-hidden rounded-lg object-contain shadow-md"
                />
              </div> */}
              <div ref={printRef} className="">
                <svg viewBox="0 0 1200 800" className="h-auto w-full pt-5">
                  {/* Background */}
                  <image
                    href={pageImgThumbnail.src}
                    width="1200"
                    height="800"
                  />

                  {/* Name */}
                  <text
                    x="485"
                    y="400"
                    // textAnchor="middle"
                    className="fill-[#fff47e] text-3xl font-bold uppercase"
                  >
                    {dataSertifikat?.name}
                  </text>

                  {/* Rank */}
                  <text
                    x="485"
                    y="470"
                    // textAnchor="middle"
                    className="fill-[#fff47e] text-3xl font-semibold uppercase"
                  >
                    {dataSertifikat?.sum_total_all?.label ?? '-'}
                  </text>

                  {/* Omset */}
                  <text
                    x="485"
                    y="535"
                    // textAnchor="middle"
                    className="fill-[#fff47e] text-3xl font-medium"
                  >
                    {dataSertifikat?.sum_total_all?.currency}
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 text-center">
          <Button
            isLoading={isPrinting}
            disabled={isPrinting}
            onClick={() => startPrint(session?.user?.id)}
          >
            <PiPrinter className="me-1.5 h-[17px] w-[17px]" />
            Cetak Sertifikat
          </Button>
        </div>
      </div>
    </>
  );
}
