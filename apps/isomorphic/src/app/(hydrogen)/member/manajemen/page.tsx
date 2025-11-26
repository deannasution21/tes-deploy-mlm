import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import ManajemenMemberTable from '@/app/shared/tables/manajemen-member/table';

export const metadata = {
  ...metaObject('Manajemen Member'),
};

export default function Page() {
  const pageHeader = {
    title: 'Manajemen Member',
    breadcrumb: [
      {
        href: routes.dashboard.index,
        name: 'Dashboard',
      },
      {
        name: 'Daftar Member',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <ManajemenMemberTable />
    </>
  );
}
