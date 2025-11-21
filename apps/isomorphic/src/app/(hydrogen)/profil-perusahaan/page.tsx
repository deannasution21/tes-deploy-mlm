import PageHeader from '@/app/shared/page-header';
import ProfilPerusahaanPage from '@/app/shared/profil-perusahaan';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Profil Perusahaan'),
};

const pageHeader = {
  title: 'Profil Perusahaan',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Profil Perusahaan',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <ProfilPerusahaanPage />
    </>
  );
}
