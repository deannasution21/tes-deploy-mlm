'use client';

import { useIsMounted } from '@core/hooks/use-is-mounted';
import HeliumLayout from '@/layouts/helium/helium-layout';
import { useLayout } from '@/layouts/use-layout';
import { LAYOUT_OPTIONS } from '@/config/enums';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Text } from 'rizzui';

type LayoutProps = {
  children: React.ReactNode;
};

export default function DefaultLayout({ children }: LayoutProps) {
  return <LayoutProvider>{children}</LayoutProvider>;
}

function LayoutProvider({ children }: LayoutProps) {
  const { data: session, status, update } = useSession();

  useEffect(() => {
    // periodically re-check session validity every 5 minutes
    const interval = setInterval(
      async () => {
        const newSession = await update();
        if (!newSession) {
          toast.error(
            <Text as="b">Sesi telah habis, silakan login ulang</Text>
          );
          setTimeout(() => {
            signOut(); // session expired or invalid
          }, 300);
        }
      },
      5 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [update]);

  // optional: immediate check if expired
  useEffect(() => {
    if (session?.expires && new Date(session.expires) < new Date()) {
      toast.error(<Text as="b">Sesi telah habis, silakan login ulang</Text>);
      setTimeout(() => {
        signOut(); // session expired or invalid
      }, 300);
    }
  }, [session]);

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
