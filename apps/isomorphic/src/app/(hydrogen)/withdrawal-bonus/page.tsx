import TransferPinPage from '@/app/shared/forms/transfer-pin';
import PageHeader from '@/app/shared/page-header';
import WithdrawalBonusTable from '@/app/shared/tables/withdrawal-bonus';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Withdrawal Bonus'),
};

const pageHeader = {
  title: 'Withdrawal Bonus',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Withdrawal Bonus',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <WithdrawalBonusTable />
    </>
  );
}
