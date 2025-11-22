import PageHeader from '@/app/shared/page-header';
import DownloadTable from '@/app/shared/tables/download';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Download File'),
};

const pageHeader = {
  title: 'Download File',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Download File',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />

      <DownloadTable />
    </>
  );
}
