import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import Posting from '@/app/shared/forms/posting';

export const metadata = {
  ...metaObject('Cloning'),
};

export default function CloningPage({ params }: any) {
  const pageHeader = {
    title: `Cloning Upline: ${params.slug}`,
    breadcrumb: [
      {
        href: routes.dashboard.index,
        name: 'Dashboard',
      },
      {
        name: 'Diagram Jaringan',
        href: routes.diagramJaringan.index,
      },
      {
        name: 'Cloning',
      },
      {
        name: params.slug,
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <Posting upline={params.slug} type="clone" />
    </>
  );
}
