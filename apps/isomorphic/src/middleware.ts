// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { pagesOptions } from '@/app/api/auth/[...nextauth]/pages-options';
import { UserRole } from '@/config/roles';
import { routes } from './config/routes';
import { isPathAllowed, getRedirectPath } from './utils/auth-utils';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const username = token?.user?.id as string;
    const role = token?.user?.role as UserRole;

    // If no role, redirect to signin
    if (!role) {
      const url = req.nextUrl.clone();
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }

    // Validate role
    if (!isValidRole(role)) {
      const url = req.nextUrl.clone();
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }

    // Check allowed route
    if (!isPathAllowed(pathname, role)) {
      const url = req.nextUrl.clone();
      url.pathname = routes.unauthorized.index;
      return NextResponse.redirect(url);
    }

    // Allow access
    return NextResponse.next();
  },
  {
    pages: {
      ...pagesOptions,
    },
  }
);

// Helper function to validate roles
function isValidRole(role: string): role is UserRole {
  return [
    'member',
    'stockist',
    'admin',
    'admin_member',
    'admin_stock',
  ].includes(role);
}

export const config = {
  matcher: [
    '/dashboard',
    '/diagram-jaringan',
    '/diagram-jaringan/:path*',
    '/pindah-id/',
    '/pindah-id/:path*',
    '/bonus/',
    '/bonus/:path*',

    // wd
    '/withdrawal-bonus',
    '/withdrawal-bonus/:path*',
    '/withdrawal-gaji',
    '/withdrawal-gaji/:path*',

    // pin
    '/lihat-pin',
    '/lihat-pin/:path*',
    '/transfer-pin',
    '/transfer-pin/:path*',

    '/produk',
    '/produk/:path*',
    '/stok',
    '/stok/:path*',
    '/member',
    '/member/:path*',

    '/stockist',
    '/stockist/:path*',

    '/peringkat',
    '/peringkat/:path*',

    '/sertifikat',
    '/sertifikat/:path*',

    '/laporan',
    '/laporan/:path*',

    // other
    '/profil',
    '/profil/:path*',
    '/download',
    '/download/:path*',
    '/profil-perusahaan',
    '/profil-perusahaan/:path*',
    '/promo',
    '/promo/:path*',
    '/kontak',
    '/kontak/:path*',
  ],
};
