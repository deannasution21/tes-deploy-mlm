'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';
import { Alert, Button, Input, Text } from 'rizzui';
import { PiMagnifyingGlassBold, PiTicketBold } from 'react-icons/pi';
import WidgetCard from '@core/components/cards/widget-card';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { routes } from '@/config/routes';
import { getPlanLabel } from '@/config/plans';
import {
  RewardPasifData,
  RewardPasifResponse,
  VoucherDetail,
} from '@/types/reward-pasif';
import VoucherPrint, {
  PrintVoucherButton,
} from '@/app/shared/reward/voucher-print';

const formatDateID = (date: string) =>
  new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

// Admin (perusahaan) mencari voucher reward pasif milik member lalu mencetaknya
export default function VoucherRewardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RewardPasifData | null>(null);

  const printRef = useRef<HTMLDivElement>(null);
  const [printVoucher, setPrintVoucher] = useState<VoucherDetail | null>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: printVoucher?.voucher_code ?? 'Voucher',
    onAfterPrint: () => setPrintVoucher(null),
  });

  useEffect(() => {
    if (printVoucher) handlePrint();
  }, [printVoucher]);

  useEffect(() => {
    if (session?.user?.role && session.user.role !== 'admin') {
      router.push(routes.unauthorized.index);
    }
  }, [session?.user?.role]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const id = username.trim().toLowerCase();
    if (!id || !session?.accessToken) return;

    setLoading(true);
    setError(null);
    setData(null);

    fetchWithAuth<RewardPasifResponse>(
      `/_transactions/withdrawal-data?username=${encodeURIComponent(id)}&type=free&category=reward`,
      { method: 'GET' },
      session.accessToken
    )
      .then((res) => setData(res?.data ?? null))
      .catch((err: any) =>
        setError(err?.message ?? 'Data member tidak dapat dimuat.')
      )
      .finally(() => setLoading(false));
  };

  const user = data?.detail_users;
  const vouchers = data?.claimed_vouchers ?? [];

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <WidgetCard
          title={<span className="text-[#c69731]">Cari Voucher Member</span>}
          titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
        >
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <Input
              label="Username Member"
              placeholder="contoh: ipg0000123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full sm:max-w-sm"
              inputClassName="[&_input]:uppercase"
            />
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!username.trim()}
              className="gap-2"
            >
              <PiMagnifyingGlassBold className="h-4 w-4" />
              Cari
            </Button>
          </form>
        </WidgetCard>

        {error && (
          <Alert variant="flat" color="danger">
            <Text>{error}</Text>
          </Alert>
        )}

        {user && (
          <WidgetCard
            title={<span className="text-[#c69731]">Data Member</span>}
            titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Info label="Username" value={user.username?.toUpperCase()} />
              <Info label="Nama" value={user.name} />
              <Info label="Paket" value={getPlanLabel(user.type_plan)} />
              <Info
                label="Poin Reward Kiri : Kanan"
                value={`${(user.point_pasif_left ?? 0).toLocaleString('id-ID')} : ${(user.point_pasif_right ?? 0).toLocaleString('id-ID')}`}
              />
            </div>
          </WidgetCard>
        )}

        {data && (
          <WidgetCard
            title={
              <span className="text-[#c69731]">
                Voucher Diklaim ({vouchers.length})
              </span>
            }
            titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
          >
            {vouchers.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-500">
                Member ini belum memiliki voucher yang diklaim.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {vouchers.map((voucher) => (
                  <div
                    key={voucher.voucher_code}
                    className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-amber-200 bg-white p-5 pt-6"
                  >
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#c69731] to-[#e0b84a]" />
                    <div className="flex items-start gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-[#c69731]">
                        <PiTicketBold className="h-6 w-6" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-xs text-gray-500">
                          {voucher.voucher_code}
                        </p>
                        <p className="text-base font-semibold leading-snug text-gray-900">
                          {voucher.title}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p>
                        Pemegang:{' '}
                        <strong className="text-gray-700">
                          {voucher.holder_name}
                        </strong>
                      </p>
                      <p>Diklaim {formatDateID(voucher.claimed_at)}</p>
                    </div>
                    {voucher.printable ? (
                      <div className="mt-auto">
                        <PrintVoucherButton
                          onClick={() => setPrintVoucher(voucher)}
                        />
                      </div>
                    ) : (
                      <p className="mt-auto text-xs text-gray-500">
                        Voucher ini tidak dapat dicetak.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </WidgetCard>
        )}
      </div>

      {/* sumber cetak, tidak tampil di layar */}
      <div className="hidden">
        {printVoucher && <VoucherPrint ref={printRef} voucher={printVoucher} />}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900">{value || '-'}</p>
    </div>
  );
}
