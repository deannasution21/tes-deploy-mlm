import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import DaftarStockist from '@/app/shared/forms/daftar-stockist';

export const metadata = {
  ...metaObject('Daftar Stockist'),
};

export default function DaftarStockistPage() {
  const pageHeader = {
    title: `Daftar Stockist`,
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
      <DaftarStockist />
    </>
  );
}
