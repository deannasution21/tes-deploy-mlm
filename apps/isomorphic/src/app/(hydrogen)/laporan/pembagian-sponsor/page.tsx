import ReportPembagianGajiPage from '@/app/shared/laporan/pembagian-gaji';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Laporan Pembagian Bonus Sponsor'),
};

const pageHeader = {
  title: 'Laporan Pembagian Bonus Sponsor',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Laporan Pembagian Bonus Sponsor',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ReportPembagianGajiPage />
    </>
  );
}
