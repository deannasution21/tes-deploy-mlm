import DiagramJaringanPage from '@/app/shared/diagram-jaringan/diagram';
import PageHeader from '@/app/shared/page-header';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import Link from 'next/link';
import { PiUserPlusBold } from 'react-icons/pi';
import { Button } from 'rizzui';

export const metadata = {
  ...metaObject('Diagram Jaringan'),
};

const pageHeader = {
  title: 'Diagram Jaringan',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Diagram Jaringan',
    },
  ],
};

export default function Page() {
  const pinKosong = 'K_b65685df-7ba4-448b-94c6-eddee77a50bc';

  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <Link
            href={routes.diagramJaringan.posting(pinKosong)}
            className="w-full @lg:w-auto"
          >
            <Button as="span" className="w-full @lg:w-auto">
              <PiUserPlusBold className="me-1.5 h-[17px] w-[17px]" />
              Posting
            </Button>
          </Link>
        </div>
      </PageHeader>

      <DiagramJaringanPage />
    </>
  );
}
