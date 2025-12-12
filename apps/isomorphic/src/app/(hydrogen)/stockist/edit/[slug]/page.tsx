import FormEditStockist from '@/app/shared/forms/stockist';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Edit Stockist'),
};

export default function Page({ params }: any) {
  const pageHeader = {
    title: `Edit Stockist: ${params?.slug?.toLocaleUpperCase()}`,
    breadcrumb: [
      {
        href: routes.dashboard.index,
        name: 'Dashboard',
      },
      {
        href: routes.stockist.manajemen.index,
        name: 'Manajemen Stockist',
      },
      {
        name: 'Edit Stockist',
      },
    ],
  };

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <FormEditStockist user_id={params?.slug} />
    </>
  );
}
