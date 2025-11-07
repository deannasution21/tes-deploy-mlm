import WithdrawalGajiForm from '@/app/shared/forms/withdrawal-gaji';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Withdrawal Gaji'),
};

export default function Page() {
  const pageHeader = {
    title: `Withdrawal Gaji`,
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
        name: 'Withdrawal',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <WithdrawalGajiForm />
    </>
  );
}
