import PageHeader from '@/app/shared/page-header';
import ListStockistTable from '@/app/shared/tables/list-stockist';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('List Stockist'),
};

const pageHeader = {
  title: 'List Stockist',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'List Stockist',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ListStockistTable />
    </>
  );
}
