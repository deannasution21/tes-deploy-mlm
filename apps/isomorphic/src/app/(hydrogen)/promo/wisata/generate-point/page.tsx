import GeneratePointWisataPage from '@/app/shared/forms/generate-point-wisata';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Generate Point Wisata'),
};

const pageHeader = {
  title: 'Generate Point Wisata',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Generate Point Wisata',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <GeneratePointWisataPage />
    </>
  );
}
