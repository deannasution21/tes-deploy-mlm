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
    '/produk',
    '/produk/:path*',
    '/profil',
    '/profil/:path',
    '/generate-pin',
    '/generate-pin/:path*',
    '/transfer-pin',
    '/transfer-pin/:path*',
    '/posting-pin',
    '/posting-pin/:path*',
    '/withdrawal-bonus',
    '/withdrawal-bonus/:path*',
    '/withdrawal-pin',
    '/withdrawal-pin/:path*',
    '/diagram-jaringan',
    '/diagram-jaringan/:path*',
    '/stockist',
    '/stockist/:path',
    '/invoice/:path*',
  ],
};
