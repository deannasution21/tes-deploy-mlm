import PageHeader from '@/app/shared/page-header';
import RewardPasifPage from '@/app/shared/reward-pasif';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Reward Pasif'),
};

const pageHeader = {
  title: 'Reward Pasif',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Reward Pasif',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <RewardPasifPage />
    </>
  );
}
