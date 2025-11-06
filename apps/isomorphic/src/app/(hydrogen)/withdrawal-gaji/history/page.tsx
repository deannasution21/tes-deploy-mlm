import PageHeader from '@/app/shared/page-header';
import HistoryWithdrawalGajiTable from '@/app/shared/withdrawal-gaji/history';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('History Withdrawal Gaji'),
};

export default function Page() {
  const pageHeader = {
    title: `History WD Gaji`,
    breadcrumb: [
      {
        href: routes.dashboard.index,
        name: 'Dashboard',
      },
      {
        name: 'Withdrawal Gaji',
        href: routes.withdrawalGaji.index,
      },
      {
        name: 'History',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <HistoryWithdrawalGajiTable />
    </>
  );
}
