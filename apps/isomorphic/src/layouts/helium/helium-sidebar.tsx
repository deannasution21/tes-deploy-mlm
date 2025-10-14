'use client';

import Link from 'next/link';
import cn from '@core/utils/class-names';
import Image from 'next/image';
import SimpleBar from '@core/ui/simplebar';
import logoImg from '@public/assets/img/logo/logo-ipg.png';
import { siteConfig } from '@/config/site.config';
import { HeliumSidebarMenu } from './helium-sidebar-menu';
import { routes } from '@/config/routes';

export default function HeliumSidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        'fixed bottom-0 start-0 z-50 h-full w-[284px] dark:bg-gray-100/50 xl:p-5 2xl:w-[308px]',
        className
      )}
    >
      <div className="relative h-full overflow-hidden bg-black p-1.5 pl-0 pr-1.5 dark:bg-gray-100/70 xl:rounded-2xl">
        <div className="bottom-overlay"></div>
        <style>{`
          .bottom-overlay {
            background-image: url('/assets/img/overlay-bottom-black-gold.png');
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 300px;
            background-repeat: no-repeat;
            background-size: auto;
            background-position: -200px -249px;
          }
        `}</style>
        <div className="sticky top-0 z-40 flex justify-center px-6 pb-5 pt-5 2xl:px-8 2xl:pt-6">
          <Link href={routes.dashboard.index} aria-label="Site Logo">
            <div className="relative aspect-square h-24">
              <Image
                src={logoImg}
                alt={siteConfig.title}
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        <SimpleBar className="h-[calc(100%-80px)]">
          <HeliumSidebarMenu />
        </SimpleBar>
      </div>
    </aside>
  );
}
