'use client';

import Image from 'next/image';
import { PiCheckBold, PiPrinter, PiXBold } from 'react-icons/pi';
import OrderViewProducts from '@/app/shared/ecommerce/order/order-products/order-view-products';
import { Title, Text, Alert, Button } from 'rizzui';
import cn from '@core/utils/class-names';
import { formatDate } from '@core/utils/format-date';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { useReactToPrint } from 'react-to-print';
import { createPortal } from 'react-dom';
import imgVA from '@public/assets/img/va-logo.png';
import imgBankTransfer from '@public/assets/img/transfer-bank.png';
import { removeUnderscore } from '@/utils/helper';

export interface TransactionDetailResponse {
  code: number;
  success: boolean;
  message: string;
  data: TransactionData;
}

export interface TransactionData {
  type: string;
  url: string;
  id: string;
  attribute: TransactionAttribute;
}

export interface TransactionAttribute {
  transaction_id: string;
  refference_id: string;
  customer: TransactionCustomer;
  payment: TransactionPayment;
  bill_payment: BillPayment;
  metadata: TransactionMetadata;
  form_data: TransactionFormData;
  status: TransactionStatus;
  waktu: string;
}

export interface TransactionCustomer {
  name: string;
  phone: string;
}

export interface TransactionPayment {
  gateway: string;
  payment_method: string;
  payment_channel: string;
  payment_name: string;
  payment_number: string;
  expired_at: string;
}

export interface BillPayment {
  sub_total: PaymentAmount;
  fee: PaymentAmount;
  discount: PaymentAmount;
  total: PaymentAmount;
}

export interface PaymentAmount {
  nominal: string;
  nominal_rp: string;
}

export interface TransactionMetadata {
  qr_string: string | null;
  qr_image: string | null;
  qr_template: string | null;
  qr_image_encoded: string | null;
  terminal: string | null;
  nns_code: string | null;
  nmid: string | null;
}

export interface TransactionFormData {
  username: string;
  customer_name: string;
  customer_phone: string;
  shipping_method: string;
  shipping_address: string;
  province: string;
  city: string;
  note: string | null;
  products: TransactionProduct[];
}

export interface TransactionProduct {
  id: string;
  name: string;
  price: number;
  stock_pin: number;
  quantity: number;
  sub_total: number;
  total_pin: number;
  plan: string;
}

export interface TransactionStatus {
  code: string;
  message: string;
}

function WidgetCard({
  title,
  className,
  children,
  childrenWrapperClass,
}: {
  title?: string;
  className?: string;
  children: React.ReactNode;
  childrenWrapperClass?: string;
}) {
  return (
    <div className={className}>
      <Title
        as="h3"
        className="mb-3.5 text-base font-semibold @5xl:mb-5 4xl:text-lg print:text-sm"
      >
        {title}
      </Title>
      <div
        className={cn(
          'rounded-lg border border-muted px-5 @sm:px-7 @5xl:rounded-xl',
          childrenWrapperClass
        )}
      >
        {children}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(<Text as="b">Nomor berhasil dicopy!</Text>);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`w-fit rounded-sm px-2 text-[13px] text-white transition print:hidden ${copied ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'} `}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export const InvoiceComponent = forwardRef<
  HTMLDivElement,
  {
    invoice: TransactionData;
    handlePrint: () => void;
    isPrinting: boolean;
  }
>(({ invoice, handlePrint, isPrinting }, ref) => {
  const orderStatus = [
    { id: 0, label: 'Pesanan Dibuat' },
    { id: 1, label: 'Menunggu Pembayaran' },
    { id: 2, label: 'Transaksi Gagal' },
    { id: 3, label: 'Pembayaran Berhasil' },
    { id: 4, label: 'Transaksi Diproses dan Dikirim' },
    { id: 5, label: 'Pesanan Selesai' },
  ];

  const rawStatus = Number(invoice?.attribute?.status?.code ?? 0);

  // Map backend → UI step
  const currentStatus =
    rawStatus === 0
      ? 1 // menunggu pembayaran
      : rawStatus === 1
        ? 3 // pembayaran selesai
        : rawStatus === -2
          ? 2 // expired
          : rawStatus === 2
            ? 4
            : 0; // fallback

  // ✅ Hide expired if status is 3, or hide selesai if expired
  const filteredStatuses = orderStatus.filter((step) => {
    // Hide "Pembayaran Expired" unless it's the actual current status (2)
    if (step.id === 2 && currentStatus !== 2) return false;

    // Hide "Pembayaran Selesai" when expired
    if (step.id === 3 && currentStatus === 2) return false;

    return true;
  });

  return (
    <>
      {isPrinting &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
            <div className="rounded-lg bg-white p-4 text-center shadow-lg">
              <p className="font-medium text-gray-700">
                Menyiapkan cetakan Invoice...
              </p>
            </div>
          </div>,
          document.body
        )}

      <div ref={ref} className="@container">
        <div className="flex flex-wrap items-center justify-center gap-3 border-b border-t border-gray-300 py-4 font-medium text-gray-700 @5xl:justify-between print:py-2 print:text-xs">
          <span className="@5xl:my-2 print:px-5">
            {/* October 22, 2022 at 10:30 pm */}
            {formatDate(
              new Date(invoice?.attribute?.waktu),
              'MMMM D, YYYY'
            )} at {formatDate(new Date(invoice?.attribute?.waktu), 'h:mm A')}
          </span>
          <div className="flex flex-col gap-3 xl:flex-row print:px-5">
            <Text
              className={`rounded-3xl px-2.5 py-1 text-xs uppercase ${currentStatus === 2 ? 'bg-red-400 text-red-dark' : currentStatus === 1 ? 'bg-yellow-300 text-primary-dark' : currentStatus === 3 ? 'bg-blue-100 text-green-dark' : 'bg-green-300 text-green-dark'} @5xl:my-2`}
            >
              {invoice?.attribute?.status?.message}
            </Text>
            <Button
              className="print:hidden"
              isLoading={isPrinting}
              disabled={isPrinting}
              onClick={() => handlePrint()}
            >
              <PiPrinter className="me-1.5 h-[17px] w-[17px]" />
              Cetak Invoice
            </Button>
          </div>
        </div>
        <div className="items-start pt-10 @5xl:grid @5xl:grid-cols-12 @5xl:gap-7 @6xl:grid-cols-10 @7xl:gap-10 print:px-5 print:pt-5">
          <div className="space-y-7 @5xl:col-span-8 @5xl:space-y-10 @6xl:col-span-7 print:space-y-3">
            <div className="">
              <OrderViewProducts
                data={invoice?.attribute?.form_data?.products ?? []}
              />
              <div className="mb-3 print:mb-0 print:hidden">
                <small className="italic text-green-700 xl:hidden">
                  *Geser table ke samping untuk melihat keseluruhan data
                </small>
              </div>
              <div className="border-t border-muted pt-7 @5xl:mt-3 print:pt-3">
                <div className="ms-auto max-w-lg space-y-6 print:space-y-3">
                  <div className="flex justify-between font-medium print:text-sm">
                    Subtotal{' '}
                    <span>
                      {invoice?.attribute?.bill_payment?.sub_total
                        ?.nominal_rp ?? 'Rp 0'}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium print:text-sm">
                    Diskon{' '}
                    <span>
                      {invoice?.attribute?.bill_payment?.discount?.nominal_rp ??
                        'Rp 0'}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium print:text-sm">
                    Biaya Admin{' '}
                    <span>
                      {/* {' '}
                    {invoice?.attribute?.bill_payment?.fee?.nominal_rp ??
                      'Rp 0'} */}
                      FREE
                    </span>
                  </div>
                  <div className="flex justify-between font-medium print:text-sm">
                    Pengiriman <span>FREE</span>
                  </div>
                  <div className="flex justify-between border-t border-muted pt-5 text-base font-semibold print:pt-3 print:text-sm">
                    Total{' '}
                    <div className="flex gap-2">
                      <Text className="text-2xl font-semibold text-green-700 print:text-lg">
                        {invoice?.attribute?.bill_payment?.total?.nominal_rp ??
                          'Rp 0'}
                      </Text>
                      {currentStatus === 1 && (
                        <CopyButton
                          text={
                            invoice?.attribute?.bill_payment?.total.nominal ?? 0
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Title
                as="h3"
                className="mb-3.5 text-base font-semibold @5xl:mb-5 @7xl:text-lg print:mb-0 print:text-sm"
              >
                Metode Pembayaran
              </Title>

              <div className="space-y-4">
                {currentStatus === 0 ? (
                  <span className="my-2 py-0.5 font-medium text-red-500 print:text-xs">
                    Bayar Sebelum: {/* October 22, 2022 at 10:30 pm */}
                    {formatDate(
                      new Date(invoice?.attribute?.payment?.expired_at),
                      'MMMM D, YYYY'
                    )}{' '}
                    at{' '}
                    {formatDate(
                      new Date(invoice?.attribute?.payment?.expired_at),
                      'h:mm A'
                    )}
                  </span>
                ) : (
                  <Text
                    className={`inline-block rounded-3xl px-2.5 py-1 text-xs uppercase ${currentStatus === 2 ? 'bg-red-400 text-red-dark' : currentStatus === 1 ? 'bg-yellow-300 text-primary-dark' : currentStatus === 3 ? 'bg-blue-100 text-blue-dark' : 'bg-green-300 text-green-dark'} @5xl:my-2`}
                  >
                    {invoice?.attribute?.status?.message}
                  </Text>
                )}
                <div className="relative flex items-center justify-between rounded-lg border border-gray-100 px-5 py-5 font-medium shadow-sm transition-shadow @5xl:px-7">
                  {(currentStatus === 2 ||
                    currentStatus === 3 ||
                    currentStatus === 4) && (
                    <div className="absolute left-0 h-full w-full bg-gray-300/50"></div>
                  )}

                  <div className="flex w-full items-center">
                    <div className="shrink-0">
                      <Image
                        src={
                          invoice?.attribute?.payment?.payment_method === 'va'
                            ? imgVA
                            : imgBankTransfer
                        }
                        alt="metode pembayaran"
                        height={60}
                        width={60}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col gap-2 ps-4 print:text-xs">
                      <Text
                        as="span"
                        className="font-lexend uppercase text-gray-700"
                      >
                        {invoice?.attribute?.payment?.payment_method
                          ? removeUnderscore(
                              invoice?.attribute?.payment?.payment_method
                            )
                          : '-'}{' '}
                        {' | '}
                        {invoice?.attribute?.payment?.payment_channel
                          ? removeUnderscore(
                              invoice?.attribute?.payment?.payment_channel
                            )
                          : '-'}
                      </Text>
                      <div className="flex flex-col gap-1">
                        <Text className="text-2xl text-green-700 print:text-sm">
                          {invoice?.attribute?.payment?.payment_number ?? '-'}
                        </Text>
                        <Text className="text-gray-500">
                          AN. {invoice?.attribute?.payment?.payment_name ?? '-'}
                        </Text>
                        {currentStatus === 1 && (
                          <CopyButton
                            text={
                              invoice?.attribute?.payment?.payment_number ?? '-'
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-7 pt-8 @container @5xl:col-span-4 @5xl:space-y-10 @5xl:pt-0 @6xl:col-span-3">
            <WidgetCard
              title="Status Pesanan"
              childrenWrapperClass="py-5 @5xl:py-8 flex"
            >
              <div className="ms-2 w-full space-y-7 border-s-2 border-gray-100">
                {filteredStatuses.map((item, index) => {
                  const isExpired = item.id === 2;
                  const isCompleted = item.id <= currentStatus;
                  const isActive = currentStatus === item.id;
                  const nextIsCompleted =
                    (item.id > currentStatus && currentStatus === 3) ||
                    (item.id > currentStatus && currentStatus === 4);

                  const nextIsExpired =
                    filteredStatuses[index + 1]?.id === 2 &&
                    currentStatus === 2;

                  return (
                    <Text
                      key={item.id}
                      className={cn(
                        'relative ps-6 text-sm font-medium before:absolute before:-start-[9px] before:top-px before:h-5 before:w-5 before:-translate-x-px before:rounded-full before:content-[""] after:absolute after:-start-px after:top-5 after:h-10 after:w-0.5 after:content-[""] last:after:hidden print:text-xs',
                        isExpired
                          ? 'text-red-600 before:bg-red-500'
                          : isCompleted || isActive || nextIsCompleted
                            ? 'text-gray-900 before:bg-primary'
                            : 'text-gray-500 before:bg-gray-200',
                        nextIsExpired
                          ? 'after:bg-red-500'
                          : isCompleted && 'after:bg-primary',
                        isExpired && 'after:hidden'
                      )}
                    >
                      {/* Completed icon */}
                      {((isCompleted && !isExpired) || nextIsCompleted) && (
                        <span className="absolute -start-1.5 top-1 text-white">
                          <PiCheckBold className="h-auto w-3" />
                        </span>
                      )}
                      {/* Expired icon */}
                      {isExpired && currentStatus === 2 && (
                        <span className="absolute -start-1.5 top-1 text-white">
                          <PiXBold className="h-auto w-3 text-white" />
                        </span>
                      )}
                      {item.label}
                      {isExpired && currentStatus === 2 && (
                        <p className="mt-1 text-xs text-gray-500">
                          Pembayaran telah melebihi batas waktu atau sudah tidak
                          valid. Silakan lakukan pesanan baru.
                        </p>
                      )}
                    </Text>
                  );
                })}
              </div>
            </WidgetCard>
            <WidgetCard
              title="Informasi Pembeli"
              childrenWrapperClass="py-5 @5xl:py-8 flex"
            >
              <div className="">
                <Title
                  as="h3"
                  className="mb-2.5 text-base font-semibold @7xl:text-lg print:text-sm"
                >
                  {invoice?.attribute?.form_data?.customer_name ?? '-'}
                </Title>
                <Text
                  as="p"
                  className="mb-2 break-all uppercase last:mb-0 print:text-xs"
                >
                  @{invoice?.attribute?.form_data?.username ?? '-'}
                </Text>
                <Text as="p" className="mb-2 last:mb-0 print:text-xs">
                  {invoice?.attribute?.form_data?.customer_phone ?? '-'}
                </Text>
              </div>
            </WidgetCard>
            <WidgetCard
              title="Alamat Pengiriman"
              childrenWrapperClass="@5xl:py-6 py-5"
            >
              <Title
                as="h3"
                className="mb-2.5 text-base font-semibold @7xl:text-lg print:text-sm"
              >
                {invoice?.attribute?.form_data?.shipping_method ?? '-'}
              </Title>
              {invoice?.attribute?.form_data?.shipping_method ===
                'PENGIRIMAN BIASA' && (
                <Text
                  as="p"
                  className="mb-2 leading-loose last:mb-0 print:text-xs"
                >
                  {invoice?.attribute?.form_data?.shipping_address ?? '-'},{' '}
                  {invoice?.attribute?.form_data?.province ?? '-'},{' '}
                  {invoice?.attribute?.form_data?.city ?? '-'}
                </Text>
              )}
            </WidgetCard>
          </div>
        </div>
      </div>
    </>
  );
});

export default function OrderView() {
  const { data: session } = useSession();
  const params = useParams();
  const invoiceID = params?.id as string;

  const [invoice, setInvoice] = useState<TransactionData | null>(null);
  const [isLoading, setLoading] = useState(true);

  const printRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: printRef, // ✅ new type-safe property
    documentTitle: `Invoice #${invoiceID}`,
    onAfterPrint: () => {
      setIsPrinting(false); // printing finished
    },
  });

  const startPrint = () => {
    setIsPrinting(true);

    // wait 150ms so UI can update before print dialog blocks JS
    setTimeout(() => {
      handlePrint();
    }, 150);
  };

  const fetchInvoice = async () => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<TransactionDetailResponse>(
      `/_transactions/${invoiceID}`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setInvoice(data.data); // <--- ADD THIS LINE
      })
      .catch((error) => {
        console.error(error);
        setInvoice(null);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    fetchInvoice();
  }, [session?.accessToken]);

  // 🕒 Detect Expiry Time
  useEffect(() => {
    const expired_at = invoice?.attribute?.payment?.expired_at;
    if (!expired_at) return;

    const expiryTime = new Date(expired_at.replace(' ', 'T'));
    if (isNaN(expiryTime.getTime())) return;

    const now = new Date();

    if (now >= expiryTime) {
      fetchInvoice();
      return;
    }

    const timeout = setTimeout(() => {
      fetchInvoice();
    }, expiryTime.getTime() - now.getTime());

    return () => clearTimeout(timeout);
  }, [invoice?.attribute?.payment?.expired_at]);

  // 🔁 Auto-Refresh Only When Status === 0 (Menunggu Pembayaran)
  useEffect(() => {
    if (invoice?.attribute?.status?.code !== '0') return;

    // Refresh every 60 seconds (you can adjust)
    const interval = setInterval(() => {
      fetchInvoice();
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [invoice?.attribute?.status?.code]);

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p>Sedang memuat data...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <Alert variant="flat" color="danger" className="mt-5">
        <Text className="font-semibold">Invoice tidak ditemukan</Text>
        <Text className="break-normal">
          Invoice bisa jadi salah atau sudah kadaluarsa
        </Text>
      </Alert>
    );
  }

  return (
    <InvoiceComponent
      invoice={invoice}
      ref={printRef}
      handlePrint={startPrint}
      isPrinting={isPrinting}
    />
  );
}
