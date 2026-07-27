import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import CheckoutPageWrapper from '@/app/shared/ecommerce/checkout';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Checkout Aktivasi Member Pasif'),
};

const pageHeader = {
  title: 'Checkout Aktivasi',
  breadcrumb: [
    {
      name: 'Dashboard',
      href: routes.dashboard.index,
    },
    {
      href: routes.promo.index,
      name: 'Promo',
    },
    {
      href: routes.promo.pasif.index,
      name: 'Pasif',
    },
    {
      name: 'Checkout',
    },
  ],
};

export default function PromoPasifCheckoutPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <CheckoutPageWrapper
        invoiceBasePath="/promo/pasif/invoice"
        lockQuantity
      />
    </>
  );
}
