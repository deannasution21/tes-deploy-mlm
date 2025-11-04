import PageHeader from '@/app/shared/page-header';
import HistoryWithdrawalBonusTable from '@/app/shared/tables/withdrawal-bonus/history';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('History Withdrawal Bonus'),
};

export default function Page({ params }: any) {
  const pageHeader = {
    title: `History WD Bonus: ${params.slug.toLocaleUpperCase()}`,
    breadcrumb: [
      {
        href: routes.dashboard.index,
        name: 'Dashboard',
      },
      {
        name: 'Withdrawal Bonus',
        href: routes.withdrawalBonus.index,
      },
      {
        name: params.slug,
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <HistoryWithdrawalBonusTable slug={params.slug} />
    </>
  );
}
