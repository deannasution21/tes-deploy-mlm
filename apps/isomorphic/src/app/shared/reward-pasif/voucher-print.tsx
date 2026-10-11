import { forwardRef } from 'react';
import { VoucherDetail } from '@/types/reward-pasif';

const formatDateTimeID = (date: string) =>
  new Date(date).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

// Tampilan voucher untuk dicetak / disimpan sebagai PDF lewat react-to-print
const VoucherPrint = forwardRef<HTMLDivElement, { voucher: VoucherDetail }>(
  ({ voucher }, ref) => (
    <div ref={ref} className="bg-white p-10 text-gray-900">
      <div className="mx-auto max-w-2xl rounded-2xl border-4 border-double border-[#c69731] p-8">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-dashed border-[#c69731] pb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/img/logo/logo-ipg3-trans.png"
            alt="IPG"
            className="h-16 w-auto"
          />
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Voucher Reward
            </p>
            <p className="font-mono text-lg font-bold">
              {voucher.voucher_code}
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-500">Hadiah</p>
        <p className="mb-6 text-3xl font-bold text-[#c69731]">
          {voucher.title}
        </p>

        <table className="mb-6 w-full text-sm">
          <tbody>
            <tr>
              <td className="w-40 py-1 text-gray-500">Nama Pemegang</td>
              <td className="py-1 font-semibold">{voucher.holder_name}</td>
            </tr>
            {voucher.username && (
              <tr>
                <td className="py-1 text-gray-500">Username</td>
                <td className="py-1 font-semibold uppercase">
                  {voucher.username}
                </td>
              </tr>
            )}
            <tr>
              <td className="py-1 text-gray-500">Tanggal Klaim</td>
              <td className="py-1 font-semibold">
                {formatDateTimeID(voucher.claimed_at)}
              </td>
            </tr>
          </tbody>
        </table>

        {voucher.note && (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-gray-700">
            {voucher.note}
          </p>
        )}
      </div>
    </div>
  )
);

VoucherPrint.displayName = 'VoucherPrint';

export default VoucherPrint;
