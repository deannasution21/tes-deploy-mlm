import ReportPembayaranGajiPage from '@/app/shared/laporan/pembayaran-gaji';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Laporan Pembayaran Gaji'),
};

const pageHeader = {
  title: 'Laporan Pembayaran Gaji',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Laporan Pembayaran Gaji',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ReportPembayaranGajiPage />
    </>
  );
}
