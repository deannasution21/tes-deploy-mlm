import PageHeader from '@/app/shared/page-header';
import PromoUmroh2026StockistPage from '@/app/shared/promo/umroh-2026-stockist';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Promo Umroh 2026 Stockist'),
};

const pageHeader = {
  title: 'Promo Umroh 2026 Stockist',
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
      name: 'Umroh 2026 Stockist',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <PromoUmroh2026StockistPage />
    </>
  );
}
