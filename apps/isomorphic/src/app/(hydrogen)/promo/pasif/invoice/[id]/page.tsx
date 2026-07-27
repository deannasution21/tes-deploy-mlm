import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import OrderView from '@/app/shared/ecommerce/order/order-view';

export default function PromoPasifInvoicePage({ params }: any) {
  const pageHeader = {
    title: `Invoice #${params.id}`,
    breadcrumb: [
      {
        href: routes.dashboard.index,
        name: 'Dashboard',
      },
      {
        href: routes.promo.pasif.index,
        name: 'Promo Pasif',
      },
      {
        name: 'Invoice',
      },
    ],
  };
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <OrderView />
    </>
  );
}
