import DiagramJaringanPage from '@/app/shared/diagram-jaringan/diagram';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Diagram Jaringan'),
};

export default function Page({ params }: any) {
  const pageHeader = {
    title: `Diagram Jaringan: ${params.slug.toLocaleUpperCase()}`,
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
        name: params.slug.toLocaleUpperCase(),
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <DiagramJaringanPage bawaUsername={params.slug} />
    </>
  );
}
