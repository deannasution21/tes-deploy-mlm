import TransferPinPage from '@/app/shared/forms/transfer-pin';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import { PiTrophy } from 'react-icons/pi';
import { Button } from 'rizzui';

export const metadata = {
  ...metaObject('Transfer PIN'),
};

const pageHeader = {
  title: 'Transfer PIN',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Transfer PIN',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <Link href={routes.lihatPin.index} className="w-full @lg:w-auto">
            <Button as="span" className="w-full @lg:w-auto">
              <PiTrophy className="me-1.5 h-[17px] w-[17px]" />
              Lihat PIN
            </Button>
          </Link>
        </div>
      </PageHeader>

      <TransferPinPage />
    </>
  );
}
