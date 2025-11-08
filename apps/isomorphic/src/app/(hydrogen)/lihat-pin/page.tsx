import PageHeader from '@/app/shared/page-header';
import LihatPinTable from '@/app/shared/tables/lihat-pin';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import { PiArrowsHorizontal } from 'react-icons/pi';
import { Button } from 'rizzui';

export const metadata = {
  ...metaObject('Lihat PIN'),
};

const pageHeader = {
  title: 'Lihat PIN',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Lihat PIN',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <Link href={routes.transferPin.index} className="w-full @lg:w-auto">
            <Button as="span" className="w-full @lg:w-auto">
              <PiArrowsHorizontal className="me-1.5 h-[17px] w-[17px]" />
              Transfer PIN
            </Button>
          </Link>
        </div>
      </PageHeader>

      <LihatPinTable />
    </>
  );
}
