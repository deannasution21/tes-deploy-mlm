import ReportTotalPinPage from '@/app/shared/laporan/total-pin';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Laporan Total PIN'),
};

const pageHeader = {
  title: 'Laporan Total PIN',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Laporan Total PIN',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ReportTotalPinPage />
    </>
  );
}
