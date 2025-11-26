import FormEditMember from '@/app/shared/forms/member';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Edit Member'),
};

export default function Page({ params }: any) {
  const pageHeader = {
    title: `Edit Member: ${params?.slug?.toLocaleUpperCase()}`,
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
        name: 'Edit Member',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <FormEditMember user_id={params?.slug} />
    </>
  );
}
