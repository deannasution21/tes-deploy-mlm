'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}): React.ReactNode {
  // session is kept alive by the interval in (hydrogen)/layout.tsx,
  // so skip the extra /api/auth/session call on every tab focus
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}
