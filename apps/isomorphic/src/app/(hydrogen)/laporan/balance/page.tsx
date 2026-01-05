import ReportBalancePage from '@/app/shared/laporan/balance';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Laporan Sisa Saldo'),
};

const pageHeader = {
  title: 'Laporan Sisa Saldo',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Laporan Sisa Saldo',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ReportBalancePage />
    </>
  );
}
