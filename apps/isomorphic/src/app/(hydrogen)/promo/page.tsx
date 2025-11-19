import PageHeader from '@/app/shared/page-header';
import PromoPage from '@/app/shared/promo';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Promo'),
};

const pageHeader = {
  title: 'Promo',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Promo',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <PromoPage />
    </>
  );
}
