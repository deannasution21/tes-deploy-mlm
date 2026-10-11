import PageHeader from '@/app/shared/page-header';
import RewardPage from '@/app/shared/reward';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Reward'),
};

const pageHeader = {
  title: 'Reward',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Reward',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <RewardPage />
    </>
  );
}
