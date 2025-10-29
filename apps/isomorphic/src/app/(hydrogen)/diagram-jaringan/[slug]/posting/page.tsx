import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import Posting from '@/app/shared/forms/posting';

export const metadata = {
  ...metaObject('Posting'),
};

export default function PostingPage({ params }: any) {
  const pageHeader = {
    title: `Posting Upline: ${params.slug.toLocaleUpperCase()}`,
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
        name: 'Posting',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <Posting upline={params.slug} type="posting" />
    </>
  );
}
