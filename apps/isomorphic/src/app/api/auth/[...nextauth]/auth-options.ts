import { type NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { pagesOptions } from './pages-options';
import { Session } from 'next-auth';
import jwt from 'jsonwebtoken';
import { JWT } from 'next-auth/jwt';
import { UserDataResponse } from '@/types';

interface ApiLoginResponse {
  code: number;
  success: boolean;
  message: string;
  data?: {
    attribute?: {
      nama: string;
      username: string;
      email: string;
      no_hp: string;
      nama_bank: string;
      no_rekening: string;
      nama_pemilik_rekening: string;
      role: string;
      status: {
        code: number;
        name: string;
      };
    };
  };
  token?: string;
}

interface CustomToken extends JWT {
  accessToken?: string;
  user?: any;
  exp?: number;
}

const env = process.env;

export const authOptions: NextAuthOptions = {
  // debug: true,
  secret: env.NEXTAUTH_SECRET,
  pages: {
    ...pagesOptions,
  },
  session: {
    strategy: 'jwt',
    maxAge: 20 * 60, // fallback, but overridden below
  },
  callbacks: {
    // async jwt({ token, user }) {
    //   // when user first logs in
    //   if (user && typeof user.token === 'string') {
    //     const decoded = jwt.decode(user.token) as jwt.JwtPayload | null;
    //     token.accessToken = user.token;
    //     token.user = user;
    //     token.exp = decoded?.exp;
    //     return token;
    //   }

    //   // 🟡 every subsequent request: check if token is still valid
    //   if (token.accessToken) {
    //     const now = Date.now() / 1000; // seconds
    //     if (typeof token.exp === 'number' && token.exp < now) {
    //       console.log('⛔ Token expired, verifying via API...');

    //       try {
    //         // ✅ Call your backend to check or refresh token
    //         const res = await fetch(
    //           `${env.NEXT_PUBLIC_API_URL}/_users/${token?.user?.id}`,
    //           {
    //             headers: { Authorization: `Bearer ${token.accessToken}` },
    //           }
    //         );

    //         if (!res.ok) {
    //           // token is invalid
    //           console.log('❌ Session invalid on server');
    //           return {}; // clears token → user becomes logged out
    //         }
    //       } catch (err) {
    //         console.error('Token validation failed:', err);
    //         return {};
    //       }
    //     }
    //   }

    //   return token;
    // },

    // async session({ session, token }) {
    //   session.user = token.user;
    //   session.accessToken = token.accessToken;

    //   if (typeof token.exp === 'number') {
    //     const expiresIn = token.exp * 1000 - Date.now();
    //     session.expires = new Date(Date.now() + expiresIn).toISOString();
    //   }

    //   return session;
    // },

    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (!token.user || !token.accessToken) {
        console.log('session expires');
        return null as unknown as Session;
      }

      if (token.user) {
        session.user = token.user; // ✅ assign only when defined
      }

      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }

      return session;
    },

    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(
        credentials: Record<string, string> | undefined
      ): Promise<User | null> {
        if (!credentials) return null;
        try {
          const res = await fetch(`${env.NEXTAUTH_API_URL}/_auth/sign-in`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
              type: credentials.role,
            }),
          });

          const data = (await res.json()) as ApiLoginResponse;

          // ✅ Validate response
          if (!res.ok || !data.success || !data.data?.attribute) {
            throw new Error(
              data?.message ||
                'Login gagal, periksa kembali email/password Anda.'
            );
          }

          // ✅ Extract user info
          const userAttr = data.data.attribute;

          // ✅ Return formatted user object for NextAuth
          return {
            id: userAttr.username,
            name: userAttr.nama_pemilik_rekening || userAttr.nama,
            email: userAttr.email,
            phone: userAttr.no_hp,
            role: userAttr.role,
            status: userAttr.status?.code,
            token: data.token, // store JWT
            bankName: userAttr.nama_bank,
            bankAccount: userAttr.no_rekening,
            bankOwner: userAttr.nama_pemilik_rekening,
          };
        } catch (err) {
          if (env.NODE_ENV !== 'production') {
            console.error('Authorize error:', err);
          }
          return null;
        }
      },
    }),
  ],
};
