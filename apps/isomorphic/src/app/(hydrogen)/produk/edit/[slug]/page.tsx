import ProdukFormPage from '@/app/shared/forms/produk';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Edit Produk'),
};

export default function Page({ params }: any) {
  const pageHeader = {
    title: `Edit Produk: ${params?.slug}`,
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
        name: 'Edit Produk',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ProdukFormPage type="edit" product_id={params?.slug} />
    </>
  );
}
