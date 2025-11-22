import PageHeader from '@/app/shared/page-header';
import ProfilPerusahaanPage from '@/app/shared/profil-perusahaan';
import { routes } from '@/config/routes';
import { metaObject } from '@/config/site.config';
import { PiDownload } from 'react-icons/pi';
import { Button } from 'rizzui';

export const metadata = {
  ...metaObject('Profil Perusahaan'),
};

const pageHeader = {
  title: 'Profil Perusahaan',
  breadcrumb: [
    {
      href: routes.dashboard.index,
      name: 'Dashboard',
    },
    {
      name: 'Profil Perusahaan',
    },
  ],
};

export default function Page() {
  return (
    <>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb}>
        <div className="mt-4 flex items-center gap-3 @lg:mt-0">
          <a
            href={'/pdf/profil-perusahaan-ipg.pdf'}
            download
            className="w-full @lg:w-auto"
          >
            <Button as="span" className="w-full @lg:w-auto">
              <PiDownload className="me-1.5 h-[17px] w-[17px]" />
              Download Profil Perusahaan
            </Button>
          </a>
        </div>
      </PageHeader>

      <ProfilPerusahaanPage />
    </>
  );
}
