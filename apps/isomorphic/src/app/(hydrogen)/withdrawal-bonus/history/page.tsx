import PageHeader from '@/app/shared/page-header';
import HistoryWithdrawalBonusTable from '@/app/shared/tables/withdrawal-bonus/history';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('History Withdrawal Bonus'),
};

export default function Page() {
  const pageHeader = {
    title: `History Withdrawal Bonus`,
    breadcrumb: [
      {
        href: routes.dashboard.index,
        name: 'Dashboard',
      },
      {
        name: 'History Withdrawal Bonus',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <HistoryWithdrawalBonusTable />
    </>
  );
}
