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
    '/profil/:path',
    '/generate-pin',
    '/history-generate-pin',
    '/transfer-pin',
    '/history-transfer-pin',
    '/posting-pin',
    '/history-posting-pin',
    '/file/:path*',
    '/file-manager',
    '/invoice/:path*',
    '/forms/profile-settings/:path*',
  ],
};
