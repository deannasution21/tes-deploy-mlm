import dynamic from 'next/dynamic';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import PageHeader from '@/app/shared/page-header';
import ProductFeed from '@/app/shared/ecommerce/shop/product-feed';

const pageHeader = {
  title: 'Pembelian Produk',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Pembelian Produk',
    },
  ],
};

export const metadata = {
  ...metaObject('Pembelian Produk'),
};

export default function ShopPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <ProductFeed />
    </>
  );
}
