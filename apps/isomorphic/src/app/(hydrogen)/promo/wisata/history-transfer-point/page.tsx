import PageHeader from '@/app/shared/page-header';
import HistoryTransferPointWisataTable from '@/app/shared/tables/history-transfer-point-wisata';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('History Transfer POINT'),
};

const pageHeader = {
  title: 'History Transfer POINT',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'History Transfer POINT',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <div className="@container">
        <div className="grid grid-cols-1 gap-6 3xl:gap-8">
          <HistoryTransferPointWisataTable typenya="send" />
        </div>
      </div>
    </>
  );
}
