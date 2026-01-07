import PageHeader from '@/app/shared/page-header';
import ListSponsorUnilevel from '@/app/shared/sponsor-unilevel';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('List Sponsor Unilevel'),
};

const pageHeader = {
  title: 'List Sponsor Unilevel',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'List Sponsor Unilevel',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <ListSponsorUnilevel />
    </>
  );
}
