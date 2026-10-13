import Link from 'next/link';
import { Button } from 'rizzui';
import { PiArrowCircleUpBold, PiGiftFill } from 'react-icons/pi';
import { routes } from '@/config/routes';

// Ditampilkan di halaman withdrawal saat member masih paket Pendaftaran:
// saldo tetap terlihat supaya member semangat upgrade, pencairannya dikunci.
export default function UpgradeToWithdrawBanner({
  what,
  message,
}: {
  what: 'bonus' | 'gaji';
  message?: string | null;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-amber-50 p-5 @3xl:p-6">
      <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#c69731] to-[#e0b84a]" />
      <div className="flex flex-col gap-4 @2xl:flex-row @2xl:items-center @2xl:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-100 text-[#c69731]">
            <PiGiftFill className="h-6 w-6" />
          </span>
          <div>
            <p className="font-semibold text-gray-900">
              {what === 'bonus' ? 'Bonus' : 'Gaji'} Anda sudah tersedia!
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Saldo di bawah ini sudah menjadi hak Anda. Upgrade paket untuk
              dapat mencairkannya.
            </p>
            {message && <p className="mt-1 text-xs text-gray-500">{message}</p>}
          </div>
        </div>
        <Link
          prefetch={false}
          href={routes.upgradePaket.index}
          className="shrink-0"
        >
          <Button className="w-full gap-2 border-0 bg-gradient-to-r from-[#c69731] via-[#e0b84a] to-[#AA8453] font-semibold text-white shadow-md hover:brightness-105 @2xl:w-auto">
            <PiArrowCircleUpBold className="h-5 w-5" />
            Upgrade Paket
          </Button>
        </Link>
      </div>
    </div>
  );
}
