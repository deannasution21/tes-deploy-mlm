import ReportSniperPage from '@/app/shared/laporan/sniper';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Laporan ID Asumsi Sniper'),
};

const pageHeader = {
  title: 'Laporan ID Asumsi Sniper',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Laporan ID Asumsi Sniper',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ReportSniperPage />
    </>
  );
}
