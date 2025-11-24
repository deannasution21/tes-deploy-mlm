import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import ManajemenStokTable from '@/app/shared/tables/manajemen-stok/table';

export const metadata = {
  ...metaObject('Manajemen Stok'),
};

export default function Page() {
  const pageHeader = {
    title: 'Manajemen Stok',
    breadcrumb: [
      {
        href: routes.dashboard.index,
        name: 'Dashboard',
      },
      {
        name: 'Daftar Stok',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ManajemenStokTable />
    </>
  );
}
