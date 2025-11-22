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
    const role = token?.user?.role as UserRole;

    // If no role or invalid role, redirect to signin
    if (!role || !isValidRole(role)) {
      const url = req.nextUrl.clone();
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }

    // Check if path is allowed for this role
    if (!isPathAllowed(pathname, role)) {
      const url = req.nextUrl.clone();
      url.pathname = routes.unauthorized.index; // Create this page
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
    'adminmember',
    'adminstock',
    'adminowner',
  ].includes(role);
}

export const config = {
  matcher: [
    '/dashboard',
    '/diagram-jaringan',
    '/diagram-jaringan/:path*',
    '/pindah-id/',
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

    '/stockist',
    '/stockist/:path*',

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
