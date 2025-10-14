'use client';

import { Title, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import pinImg from '@public/pin.png';
import Image from 'next/image';

const data = [
  { name: 'PIN General:', value: 20, color: '#3872FA' },
  { name: 'PIN Reguler:', value: 18, color: '#eab308' },
  { name: 'PIN Promo:', value: 35, color: '#10b981' },
];

export default function FleetStatus({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-5 border-0 p-0 lg:p-0', className)}>
      <div className="grid items-start rounded-lg border border-muted p-5 @xl:grid-cols-2 lg:p-7">
        <Title
          as="h3"
          className="col-span-full mb-8 text-base font-semibold sm:text-lg"
        >
          Informasi PIN Anda
        </Title>
        <div className="mx-auto h-44 w-44">
          <div className="animate-pin-tilt relative mx-auto aspect-square">
            <Image
              src={pinImg}
              alt=""
              fill
              priority
              className="object-contain"
            />
          </div>

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
        </div>

        <div className="">
          {data.map((item, index) => (
            <div
              key={index}
              className="mb-4 flex items-center justify-between border-b border-muted pb-4 last:mb-0 last:border-0 last:pb-0"
            >
              <div className="flex items-center justify-start">
                <span
                  className="me-2 h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <Title as="h5" className="text-sm font-medium">
                  {item.name}
                </Title>
              </div>
              <Text as="span">{item.value}</Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
