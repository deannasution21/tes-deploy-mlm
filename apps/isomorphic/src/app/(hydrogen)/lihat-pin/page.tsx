import PageHeader from '@/app/shared/page-header';
import LihatPinTable from '@/app/shared/tables/lihat-pin';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Lihat PIN'),
};

const pageHeader = {
  title: 'Lihat PIN',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Lihat PIN',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <LihatPinTable />
    </>
  );
}
