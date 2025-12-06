import ReportPembayaranBonusPage from '@/app/shared/laporan/pembayaran-bonus';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Laporan Pembayaran Bonus'),
};

const pageHeader = {
  title: 'Laporan Pembayaran Bonus',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Laporan Pembayaran Bonus',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ReportPembayaranBonusPage />
    </>
  );
}
