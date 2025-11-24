import PageHeader from '@/app/shared/page-header';
import ListPeringkatTable from '@/app/shared/tables/peringkat';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Peringkat'),
};

const pageHeader = {
  title: 'Peringkat',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Peringkat',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ListPeringkatTable />
    </>
  );
}
