import { type NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { pagesOptions } from './pages-options';

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

const env = process.env;

export const authOptions: NextAuthOptions = {
  // debug: true,
  secret: env.NEXTAUTH_SECRET,
  pages: {
    ...pagesOptions,
  },
  session: {
    strategy: 'jwt',
    maxAge: 15 * 60, // expire after 15 minutes
    updateAge: 5 * 60, // refresh token every 5 minutes
  },
  // ✅ Attach token & session callbacks
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
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
            role: userAttr.role,
            status: userAttr.status?.code,
            token: data.token, // store JWT
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
