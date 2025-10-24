import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import ProductDetails from '@/app/shared/ecommerce/product/product-details';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Belanja Produk'),
};

export default function ProductDetailsPage({ params }: any) {
  const pageHeader = {
    title: 'Belanja Produk',
    breadcrumb: [
      {
        href: routes.dashboard.index,
        name: 'Dashboard',
      },
      {
        href: routes.produk.index,
        name: 'Belanja Produk',
      },
      {
        name: params.slug,
      },
    ],
  };
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ProductDetails />
    </>
  );
}
