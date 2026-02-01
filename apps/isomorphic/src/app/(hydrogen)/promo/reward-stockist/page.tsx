import PageHeader from '@/app/shared/page-header';
import PromoRewardStockistPage from '@/app/shared/promo/reward-stockist';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Promo Reward Stockist'),
};

const pageHeader = {
  title: 'Promo Reward Stockist',
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
      name: 'Reward Stockist',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <PromoRewardStockistPage />
    </>
  );
}
