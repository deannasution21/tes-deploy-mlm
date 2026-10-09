import PageHeader from '@/app/shared/page-header';
import UpgradePaketPage from '@/app/shared/upgrade-paket';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Upgrade Paket'),
};

const pageHeader = {
  title: 'Upgrade Paket',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Upgrade Paket',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <UpgradePaketPage />
    </>
  );
}
