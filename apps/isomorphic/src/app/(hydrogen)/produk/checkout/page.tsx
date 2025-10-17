import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import CheckoutPageWrapper from '@/app/shared/ecommerce/checkout';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Checkout'),
};

const pageHeader = {
  title: 'Checkout',
  breadcrumb: [
    {
      name: 'Dashboard',
      href: routes.dashboard.index,
    },
    {
      href: routes.produk.index,
      name: 'Produk',
    },
    {
      name: 'Checkout',
    },
  ],
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CheckoutPageWrapper />
    </>
  );
}
