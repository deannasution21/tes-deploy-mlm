import NextAuth, { DefaultSession } from 'next-auth';

interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  bankName?: string | null;
  bankAccount?: string | null;
  bankOwner?: string | null;
  role?: string | null;
  status?: number | null;
  token?: string | null;
}

declare module 'next-auth' {
  interface Session {
    accessToken?: string | null;
    user?: ExtendedUser & DefaultSession['user'];
  }

  interface User extends ExtendedUser {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string | null;
    user?: ExtendedUser;
  }
}
