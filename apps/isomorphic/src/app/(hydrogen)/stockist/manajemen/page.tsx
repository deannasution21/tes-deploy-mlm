import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import ManajemenStockistTable from '@/app/shared/tables/manajemen-stockist/table';

export const metadata = {
  ...metaObject('Manajemen Stockist'),
};

export default function Page() {
  const pageHeader = {
    title: 'Manajemen Stockist',
    breadcrumb: [
      {
        href: routes.dashboard.index,
        name: 'Dashboard',
      },
      {
        name: 'Daftar Stockist',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <ManajemenStockistTable />
    </>
  );
}
