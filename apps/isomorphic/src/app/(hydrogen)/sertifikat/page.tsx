import PageHeader from '@/app/shared/page-header';
import SertifikatPage from '@/app/shared/sertifikat';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Sertifikat'),
};

const pageHeader = {
  title: 'Sertifikat',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Sertifikat',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <SertifikatPage />
    </>
  );
}
