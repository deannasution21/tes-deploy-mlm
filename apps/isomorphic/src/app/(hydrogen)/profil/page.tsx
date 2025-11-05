import ProfilSayaPage from '@/app/shared/forms/profil-saya';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Profil Saya'),
};

const pageHeader = {
  title: 'Profil Saya',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Profil Saya',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ProfilSayaPage />
    </>
  );
}
