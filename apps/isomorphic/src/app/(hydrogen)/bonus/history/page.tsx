import HistoryBonusPage from '@/app/shared/history-bonus/history';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('History Bonus'),
};

const pageHeader = {
  title: 'History Bonus',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      href: routes.bonus.index,
      name: 'Bonus',
    },
    {
      name: 'History',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <HistoryBonusPage />
    </>
  );
}
