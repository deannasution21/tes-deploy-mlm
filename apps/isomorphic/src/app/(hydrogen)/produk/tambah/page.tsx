import ProdukFormPage from '@/app/shared/forms/produk';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Tambah Produk'),
};

const pageHeader = {
  title: 'Tambah Produk',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      href: routes.produk.manajemen.index,
      name: 'Manajemen Produk',
    },
    {
      name: 'Tambah Produk',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ProdukFormPage type="tambah" />
    </>
  );
}
