import { pagesOptions } from '@/app/api/auth/[...nextauth]/pages-options';
import withAuth from 'next-auth/middleware';

export default withAuth({
  pages: {
    ...pagesOptions,
  },
});

export const config = {
  // restricted routes
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
