import Link from 'next/link';
import { routes } from '@/config/routes';
import { Button } from 'rizzui';
import PageHeader from '@/app/shared/page-header';
import OrdersTable from '@/app/shared/ecommerce/order/order-list/table';
import { PiShoppingCart } from 'react-icons/pi';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('History Pembelian Produk'),
};

export default function OrdersPage() {
  const pageHeader = {
    title: 'History Pembelian Stockist',
    breadcrumb: [
      {
        href: routes.dashboard.index,
        name: 'Dashboard',
      },
      {
        href: routes.produk.index,
        name: 'Pembelian Produk',
      },
      {
        name: 'History',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <Link href={routes.produk.index} className="w-full @lg:w-auto">
            <Button as="span" className="w-full @lg:w-auto">
              <PiShoppingCart className="me-1.5 h-[17px] w-[17px]" />
              Pembelian Produk
            </Button>
          </Link>
        </div>
      </PageHeader>

      <OrdersTable />
    </>
  );
}
