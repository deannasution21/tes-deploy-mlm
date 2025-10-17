import { metaObject } from '@/config/site.config';
import WelcomePage from './(other-pages)/welcome/page';

export const metadata = {
  ...metaObject('Selamat Datang di Infinite Prestige Global!'),
};

export default function BlankPage() {
  return <WelcomePage />;
}
