import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import OrderView from '@/app/shared/ecommerce/order/order-view';

export default function OrderDetailsPage({ params }: any) {
  const pageHeader = {
    title: `Invoice #${params.id}`,
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
        href: routes.produk.pesanan.index,
        name: 'History',
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
