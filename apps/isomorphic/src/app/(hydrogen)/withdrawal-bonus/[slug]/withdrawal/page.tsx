import WithdrawalBonusForm from '@/app/shared/forms/withdrawal-bonus';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Withdrawal Bonus'),
};

export default function Page({ params }: any) {
  const pageHeader = {
    title: `Withdrawal Bonus: ${params.slug.toLocaleUpperCase()}`,
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
        name: 'Withdrawal',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <WithdrawalBonusForm slug={params.slug} />
    </>
  );
}
