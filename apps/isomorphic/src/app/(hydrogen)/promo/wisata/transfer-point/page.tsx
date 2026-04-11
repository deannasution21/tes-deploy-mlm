import TransferPointWisataPage from '@/app/shared/forms/transfer-point-wisata';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Transfer Point Wisata'),
};

const pageHeader = {
  title: 'Transfer Point Wisata',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Transfer Point Wisata',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <TransferPointWisataPage />
    </>
  );
}
