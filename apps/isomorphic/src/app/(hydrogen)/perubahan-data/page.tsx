import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import PerubahanDataForm from '@/app/shared/forms/perubahan-data';

export const metadata = {
  ...metaObject('Pengajuan Perubahan Data'),
};

export default function PerubahanDataPage({ params }: any) {
  const pageHeader = {
    title: `Pengajuan Perubahan Data`,
    breadcrumb: [
      {
        href: routes.dashboard.index,
        name: 'Dashboard',
      },
      {
        name: 'Pengajuan Perubahan Data',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <PerubahanDataForm />
    </>
  );
}
