import PageHeader from '@/app/shared/page-header';
import HistoryGeneratePointWisataTable from '@/app/shared/tables/history-generate-point-wisata';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import { PiBriefcase } from 'react-icons/pi';
import { Button } from 'rizzui';

export const metadata = {
  ...metaObject('History Generate POINT'),
};

const pageHeader = {
  title: 'History Generate POINT',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'History Generate POINT',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <Link
            href={routes.promo.wisata.generatePoint}
            className="w-full @lg:w-auto"
          >
            <Button as="span" className="w-full @lg:w-auto">
              <PiBriefcase className="me-1.5 h-[17px] w-[17px]" />
              Generate POINT
            </Button>
          </Link>
        </div>
      </PageHeader>

      <div className="@container">
        <div className="grid grid-cols-1 gap-6 3xl:gap-8">
          <HistoryGeneratePointWisataTable />
        </div>
      </div>
    </>
  );
}
