import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { pagesOptions } from '@/app/api/auth/[...nextauth]/pages-options';
import { routes } from './config/routes';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.user?.role; // access the user's role from token

    // Example restriction: "member" CANNOT access "/produk" routes
    if (role === 'member' && pathname.startsWith('/produk')) {
      // redirect them somewhere safe
      const url = req.nextUrl.clone();
      url.pathname = routes.unauthorized.index;
      return NextResponse.redirect(url);
    }

    // Otherwise, allow access
    return NextResponse.next();
  },
  {
    pages: {
      ...pagesOptions,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/history-bonus',
    '/pindah-id/',
    '/bonus/',
    '/bonus/:path*',
    '/produk',
    '/produk/:path*',
    '/profil',
    '/profil/:path',
    '/lihat-pin',
    '/lihat-pin/:path*',
    '/generate-pin',
    '/generate-pin/:path*',
    '/transfer-pin',
    '/transfer-pin/:path*',
    '/withdrawal-bonus',
    '/withdrawal-bonus/:path*',
    '/withdrawal-gaji',
    '/withdrawal-gaji/:path*',
    '/diagram-jaringan',
    '/diagram-jaringan/:path*',
    '/stockist',
    '/stockist/:path',
    '/invoice/:path*',
  ],
};
