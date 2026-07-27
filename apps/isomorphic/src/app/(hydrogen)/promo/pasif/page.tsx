import PageHeader from '@/app/shared/page-header';
import PromoPasifPage from '@/app/shared/promo/pasif';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Promo Pasif'),
};

const pageHeader = {
  title: 'Promo Pasif',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      href: routes.promo.index,
      name: 'Promo',
    },
    {
      name: 'Pasif',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <PromoPasifPage />
    </>
  );
}
