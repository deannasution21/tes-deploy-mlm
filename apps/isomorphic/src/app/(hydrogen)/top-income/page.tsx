import PageHeader from '@/app/shared/page-header';
import TopIncomeTable from '@/app/shared/tables/top-income';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Top Income'),
};

const pageHeader = {
  title: 'Top Income',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Top Income',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <TopIncomeTable />
    </>
  );
}
