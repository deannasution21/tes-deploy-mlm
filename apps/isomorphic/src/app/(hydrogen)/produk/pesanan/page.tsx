import Link from 'next/link';
import { routes } from '@/config/routes';
import { Button } from 'rizzui';
import PageHeader from '@/app/shared/page-header';
import OrdersTable from '@/app/shared/ecommerce/order/order-list/table';
import { PiPlusBold, PiShoppingCart } from 'react-icons/pi';
import { orderData } from '@/data/order-data';
import { metaObject } from '@/config/site.config';
import ExportButton from '@/app/shared/export-button';

export const metadata = {
  ...metaObject('History Belanja Produk'),
};

const pageHeader = {
  title: 'History Belanja Produk',
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
      name: 'History',
    },
  ],
};

export default function OrdersPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <Link href={routes.produk.index} className="w-full @lg:w-auto">
            <Button as="span" className="w-full @lg:w-auto">
              <PiShoppingCart className="me-1.5 h-[17px] w-[17px]" />
              Belanja Produk
            </Button>
          </Link>
        </div>
      </PageHeader>

      <OrdersTable />
    </>
  );
}
