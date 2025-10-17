import { Button } from 'rizzui';
import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import Link from 'next/link';
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
        name: 'Produk',
      },
      {
        name: 'Invoice',
      },
      {
        name: params.id,
      },
    ],
  };
  return (
    <>
      <PageHeader
        title={pageHeader.title}
        breadcrumb={pageHeader.breadcrumb}
      ></PageHeader>
      <OrderView />
    </>
  );
}
