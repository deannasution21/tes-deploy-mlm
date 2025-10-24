import { routes } from '@/config/routes';
import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import Posting from '@/app/shared/forms/posting';

export const metadata = {
  ...metaObject('Posting'),
};

const pageHeader = {
  title: 'Order',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      href: routes.diagramJaringan.index,
      name: 'Diagram jaringan',
    },
    {
      name: 'Posting',
    },
  ],
};

export default function PostingPage() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <Posting />
    </>
  );
}
