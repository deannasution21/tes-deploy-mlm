import PageHeader from '@/app/shared/page-header';
import PromoWisataPage from '@/app/shared/promo/wisata';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Promo Wisata'),
};

const pageHeader = {
  title: 'Promo Wisata',
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
      name: 'Wisata',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <PromoWisataPage />
    </>
  );
}
