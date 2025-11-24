import StokFormPage from '@/app/shared/forms/stok';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Edit Stok Produk'),
};

export default function Page({ params }: any) {
  const pageHeader = {
    title: `Edit Stok Produk: ${params?.slug}`,
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
        name: 'Edit Stok Produk',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <StokFormPage type="edit" product_id={params?.slug} />
    </>
  );
}
