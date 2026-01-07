import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import KonfirmasiMemberTable from '@/app/shared/tables/konfirmasi-member/table';

export const metadata = {
  ...metaObject('Konfirmasi Data Member'),
};

export default function Page() {
  const pageHeader = {
    title: 'Konfirmasi Data Member',
    breadcrumb: [
      {
        href: routes.dashboard.index,
        name: 'Dashboard',
      },
      {
        name: 'Daftar Pengajuan Data',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <KonfirmasiMemberTable />
    </>
  );
}
