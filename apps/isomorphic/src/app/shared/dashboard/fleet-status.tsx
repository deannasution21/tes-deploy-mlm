'use client';

import { Title, Text, Button } from 'rizzui';
import cn from '@core/utils/class-names';
import pinImg from '@public/pin.png';
import Image from 'next/image';
import TagIcon from '@core/components/icons/tag';
import TagIcon2 from '@core/components/icons/tag-2';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';
import { PiTrophy } from 'react-icons/pi';
import Link from 'next/link';

const data = [
  { name: 'PIN General:', value: 20, color: '#3872FA' },
  { name: 'PIN Reguler:', value: 18, color: '#eab308' },
  { name: 'PIN Promo:', value: 35, color: '#10b981' },
];

export default function FleetStatus({
  pins,
  className,
}: {
  pins?: number;
  className?: string;
}) {
  const router = useRouter();

  return (
    <div className={cn('flex flex-col gap-5 border-0 p-0 lg:p-0', className)}>
      <div className="rounded-lg border border-muted p-5 lg:p-7">
        <Title
          as="h3"
          className="col-span-full mb-8 text-center text-base font-semibold sm:text-lg"
        >
          Informasi PIN Anda
        </Title>
        <div className="mx-auto mb-5 h-40 w-40">
          <style>{`
            @keyframes pinTilt {
              0%,
              100% {
                transform: rotateY(0deg);
              }
              25% {
                transform: rotateY(20deg);
              }
              75% {
                transform: rotateY(-20deg);
              }
            }

            .animate-pin-tilt {
              animation: pinTilt 6s ease-in-out infinite;
              transform-style: preserve-3d;
            }
          `}</style>
          <div className="animate-pin-tilt relative mx-auto aspect-square">
            <Image
              src={pinImg}
              alt=""
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>
        <div className="mb-2 text-center">
          <Title as="h4" className="text-primary">
            PLAN
          </Title>
        </div>
        <div className="relative border-b border-gray-300 pb-7 text-center">
          <Title as="h6" className="mb-3 text-center">
            Total PIN Anda:{' '}
            <strong className="text-xl text-primary">{pins ?? 0} PIN</strong>
          </Title>
        </div>
        <div className="relative pb-3 pt-7">
          <Link href={routes.lihatPin.index}>
            <Button className="w-full">Lihat PIN</Button>
          </Link>
        </div>
      </div>
      <div className="hidden">
        <div className="grid gap-5 rounded-lg border border-muted p-4 @2xl:grid-cols-2 @2xl:p-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-12 w-12 items-center justify-center">
              {/* <HourGlassIcon className="h-8 w-8" /> */}
              <TagIcon className="h-full w-full" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">3 POIN</p>
              <p>Total Poin Kiri</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-12 w-12 items-center justify-center">
              {/* <WeighingScale className="h-8 w-8" /> */}
              <TagIcon2 className="h-full w-full" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">7 POIN</p>
              <p>Total Poin Kanan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
