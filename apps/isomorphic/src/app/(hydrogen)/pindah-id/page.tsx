import PageHeader from '@/app/shared/page-header';
import PindahIDTable from '@/app/shared/tables/pindah-id';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Pindah ID'),
};

const pageHeader = {
  title: 'Pindah ID',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Pindah ID',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <PindahIDTable />
    </>
  );
}
