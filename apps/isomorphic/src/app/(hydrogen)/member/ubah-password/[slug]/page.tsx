import UbahPasswordMemberPage from '@/app/shared/forms/ubah-password-member';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Ubah Password Member'),
};

export default function Page({ params }: any) {
  const pageHeader = {
    title: `Ubah Password Member: ${params?.slug?.toLocaleUpperCase()}`,
    breadcrumb: [
      {
        href: routes.dashboard.index,
        name: 'Dashboard',
      },
      {
        href: routes.member.manajemen.index,
        name: 'Manajemen Member',
      },
      {
        name: 'Ubah Password',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <UbahPasswordMemberPage user_id={params?.slug} />
    </>
  );
}
