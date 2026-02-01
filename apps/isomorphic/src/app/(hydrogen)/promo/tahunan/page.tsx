import PageHeader from '@/app/shared/page-header';
import PromoTahunanPage from '@/app/shared/promo/tahunan';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Promo Tahunan'),
};

const pageHeader = {
  title: 'Promo Tahunan',
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
      name: 'Tahunan',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <PromoTahunanPage />
    </>
  );
}
