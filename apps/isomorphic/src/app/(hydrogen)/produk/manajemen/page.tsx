import Link from 'next/link';
import { routes } from '@/config/routes';
import { Button } from 'rizzui';
import PageHeader from '@/app/shared/page-header';
import { PiPlus } from 'react-icons/pi';
import { metaObject } from '@/config/site.config';
import ManajemenProdukTable from '@/app/shared/tables/manajemen-produk/table';

export const metadata = {
  ...metaObject('Manajemen Produk'),
};

export default function Page() {
  const pageHeader = {
    title: 'Manajemen Produk',
    breadcrumb: [
      {
        href: routes.dashboard.index,
        name: 'Dashboard',
      },
      {
        name: 'Daftar Produk',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <Link
            href={routes.produk.manajemen.tambah}
            className="w-full @lg:w-auto"
          >
            <Button as="span" className="w-full @lg:w-auto">
              <PiPlus className="me-1.5 h-[17px] w-[17px]" />
              Tambah Produk
            </Button>
          </Link>
        </div>
      </PageHeader>

      <ManajemenProdukTable />
    </>
  );
}
