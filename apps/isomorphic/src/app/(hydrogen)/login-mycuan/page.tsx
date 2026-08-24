import LoginMyCuanPage from '@/app/shared/forms/login-mycuan';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Login MyCuan'),
};

const pageHeader = {
  title: 'Daftar / Masuk MyCuan',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Login MyCuan',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <LoginMyCuanPage />
    </>
  );
}
