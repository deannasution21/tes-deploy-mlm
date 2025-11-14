import { metaObject } from '@/config/site.config';
import DashboardPage from '@/app/shared/dashboard';

export const metadata = {
  ...metaObject('Dashboard'),
};

export default function DashboardPengguna() {
  return <DashboardPage />;
}
