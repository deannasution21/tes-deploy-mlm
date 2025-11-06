import PageHeader from '@/app/shared/page-header';
import WithdrawalGajiPage from '@/app/shared/withdrawal-gaji';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Withdrawal Gaji'),
};

const pageHeader = {
  title: 'Withdrawal Gaji',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Withdrawal Gaji',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <WithdrawalGajiPage />
    </>
  );
}
