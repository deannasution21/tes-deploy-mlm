'use client';

import { useIsMounted } from '@core/hooks/use-is-mounted';
import HeliumLayout from '@/layouts/helium/helium-layout';
import { useLayout } from '@/layouts/use-layout';
import { LAYOUT_OPTIONS } from '@/config/enums';
import { usePathname } from 'next/navigation';

type LayoutProps = {
  children: React.ReactNode;
};

export default function DefaultLayout({ children }: LayoutProps) {
  return <LayoutProvider>{children}</LayoutProvider>;
}

function LayoutProvider({ children }: LayoutProps) {
  const { layout } = useLayout();
  const isMounted = useIsMounted();
  const pathname = usePathname();

  if (!isMounted) {
    return null;
  }

  if (pathname === '/') {
    return <>{children}</>;
  }

  // Otherwise, wrap all other routes in HeliumLayout
  return <HeliumLayout>{children}</HeliumLayout>;
}
