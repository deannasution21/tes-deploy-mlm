'use client';

import Image from 'next/image';
import { useAtomValue } from 'jotai';
import isEmpty from 'lodash/isEmpty';
import { PiCheckBold } from 'react-icons/pi';
import {
  billingAddressAtom,
  orderNoteAtom,
  shippingAddressAtom,
} from '@/store/checkout';
import OrderViewProducts from '@/app/shared/ecommerce/order/order-products/order-view-products';
import { useCart } from '@/store/quick-cart/cart.context';
import { Title, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import { toCurrency } from '@core/utils/to-currency';
import { formatDate } from '@core/utils/format-date';
import usePrice from '@core/hooks/use-price';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

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

const orderStatus = [
  { id: '', label: 'Pesanan Dibuat' },
  { id: '0', label: 'Menunggu Pembayaran' },
  { id: '1', label: 'Pembayaran Selesai' },
  { id: '2', label: 'Produk Dikirimkan' },
  { id: '3', label: 'Pesanan Selesai' },
];

const currentOrderStatus = 2;

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
        className="mb-3.5 text-base font-semibold @5xl:mb-5 4xl:text-lg"
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
      className={`w-fit rounded-sm px-2 text-[13px] text-white transition ${copied ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'} `}
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export default function OrderView() {
  const { data: session } = useSession();
  const params = useParams();
  const invoiceID = params?.id as string;

  const [invoice, setInvoice] = useState<TransactionDetailResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDataInvoice = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/_transactions/${invoiceID}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-app-token': session?.accessToken ?? '',
            },
          }
        );

        if (!res.ok) throw new Error(`HTTP error! ${res.status}`);

        const data = (await res.json()) as TransactionDetailResponse;
        setInvoice(data);
      } catch (error) {
        console.error('Fetch data error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken && invoiceID) getDataInvoice();
  }, [session?.accessToken, invoiceID]);

  if (!invoice) return <div>Invoice tidak ditemukan.</div>;

  // const { items, total, totalItems } = useCart();
  // const { price: subtotal } = usePrice(
  //   items && {
  //     amount: total,
  //   }
  // );
  // const { price: totalPrice } = usePrice({
  //   amount: total,
  // });

  return (
    <div className="@container">
      <div className="flex flex-wrap justify-center border-b border-t border-gray-300 py-4 font-medium text-gray-700 @5xl:justify-start">
        <span className="my-2 border-r border-muted px-5 py-0.5 first:ps-0 last:border-r-0">
          {/* October 22, 2022 at 10:30 pm */}
          {formatDate(
            new Date(invoice?.data?.attribute?.waktu),
            'MMMM D, YYYY'
          )}{' '}
          at {formatDate(new Date(invoice?.data?.attribute?.waktu), 'h:mm A')}
        </span>
        <span className="my-2 border-r border-muted px-5 py-0.5 first:ps-0 last:border-r-0">
          {invoice?.data?.attribute?.form_data?.products?.length ?? 0} Produk
        </span>
        <span className="my-2 border-r border-muted px-5 py-0.5 first:ps-0 last:border-r-0">
          Total{' '}
          {invoice?.data?.attribute?.bill_payment?.total?.nominal_rp ?? 'Rp 0'}
        </span>
        <span className="my-2 ms-5 rounded-3xl border-r border-muted bg-green-lighter px-2.5 py-1 text-xs text-green-dark first:ps-0 last:border-r-0">
          {invoice?.data?.attribute?.status?.message}
        </span>
      </div>
      <div className="items-start pt-10 @5xl:grid @5xl:grid-cols-12 @5xl:gap-7 @6xl:grid-cols-10 @7xl:gap-10">
        <div className="space-y-7 @5xl:col-span-8 @5xl:space-y-10 @6xl:col-span-7">
          <div className="pb-5">
            <OrderViewProducts
              data={invoice?.data?.attribute?.form_data?.products ?? []}
            />
            <div className="border-t border-muted pt-7 @5xl:mt-3">
              <div className="ms-auto max-w-lg space-y-6">
                <div className="flex justify-between font-medium">
                  Subtotal{' '}
                  <span>
                    {invoice?.data?.attribute?.bill_payment?.sub_total
                      ?.nominal_rp ?? 'Rp 0'}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  Biaya Admin{' '}
                  <span>
                    {' '}
                    {invoice?.data?.attribute?.bill_payment?.fee?.nominal_rp ??
                      'Rp 0'}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  Pengiriman <span>FREE</span>
                </div>
                <div className="flex justify-between border-t border-muted pt-5 text-base font-semibold">
                  Total{' '}
                  <span>
                    {invoice?.data?.attribute?.bill_payment?.total
                      ?.nominal_rp ?? 'Rp 0'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <Title
              as="h3"
              className="mb-3.5 text-base font-semibold @5xl:mb-5 @7xl:text-lg"
            >
              Metode Pembayaran
            </Title>

            <div className="space-y-4">
              <span className="my-2 py-0.5 font-medium text-red-500">
                Bayar Sebelum: {/* October 22, 2022 at 10:30 pm */}
                {formatDate(
                  new Date(invoice?.data?.attribute?.payment?.expired_at),
                  'MMMM D, YYYY'
                )}{' '}
                at{' '}
                {formatDate(
                  new Date(invoice?.data?.attribute?.payment?.expired_at),
                  'h:mm A'
                )}
              </span>
              <div className="flex items-center justify-between rounded-lg border border-gray-100 px-5 py-5 font-medium shadow-sm transition-shadow @5xl:px-7">
                <div className="flex w-full items-center">
                  <div className="shrink-0">
                    <Image
                      src={
                        'https://isomorphic-furyroad.s3.amazonaws.com/public/payment/master.png'
                      }
                      alt="metode pembayaran"
                      height={60}
                      width={60}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col ps-4">
                    <Text as="span" className="font-lexend text-gray-700">
                      {invoice?.data?.attribute?.payment?.payment_method ?? '-'}{' '}
                      {' | '}
                      {invoice?.data?.attribute?.payment?.payment_channel ??
                        '-'}
                    </Text>
                    <div className="flex flex-col gap-2 md:flex-row">
                      <span className="pt-1 text-[14px] font-normal text-gray-500">
                        {invoice?.data?.attribute?.payment?.payment_number ??
                          '-'}
                        - AN.{' '}
                        {invoice?.data?.attribute?.payment?.payment_name ?? '-'}
                      </span>
                      <CopyButton
                        text={
                          invoice?.data?.attribute?.payment?.payment_number ??
                          '-'
                        }
                      />
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
              {orderStatus.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "relative ps-6 text-sm font-medium before:absolute before:-start-[9px] before:top-px before:h-5 before:w-5 before:-translate-x-px before:rounded-full before:bg-gray-100 before:content-[''] after:absolute after:-start-px after:top-5 after:h-10 after:w-0.5 after:content-[''] last:after:hidden",
                    invoice?.data?.attribute?.status?.code > item.id
                      ? 'before:bg-primary after:bg-primary'
                      : 'after:hidden',
                    invoice?.data?.attribute?.status?.code === item.id &&
                      'before:bg-primary'
                  )}
                >
                  {invoice?.data?.attribute?.status?.code >= item.id ? (
                    <span className="absolute -start-1.5 top-1 text-white">
                      <PiCheckBold className="h-auto w-3" />
                    </span>
                  ) : null}

                  {item.label}
                </div>
              ))}
            </div>
          </WidgetCard>

          <WidgetCard
            title="Informasi Pembeli"
            childrenWrapperClass="py-5 @5xl:py-8 flex"
          >
            <div className="relative aspect-square h-16 w-16 shrink-0 @5xl:h-20 @5xl:w-20">
              <Image
                fill
                alt="avatar"
                className="object-cover"
                sizes="(max-width: 768px) 100vw"
                src="https://isomorphic-furyroad.s3.amazonaws.com/public/avatar.png"
              />
            </div>
            <div className="ps-4 @5xl:ps-6">
              <Title
                as="h3"
                className="mb-2.5 text-base font-semibold @7xl:text-lg"
              >
                {invoice?.data?.attribute?.form_data?.customer_name ?? '-'}
              </Title>
              <Text as="p" className="mb-2 break-all last:mb-0">
                {'@' + invoice?.data?.attribute?.form_data?.username ?? '-'}
              </Text>
              <Text as="p" className="mb-2 last:mb-0">
                {invoice?.data?.attribute?.form_data?.customer_phone ?? '-'}
              </Text>
            </div>
          </WidgetCard>

          <WidgetCard
            title="Alamat Pengiriman"
            childrenWrapperClass="@5xl:py-6 py-5"
          >
            <Title
              as="h3"
              className="mb-2.5 text-base font-semibold @7xl:text-lg"
            >
              {invoice?.data?.attribute?.form_data?.shipping_method ?? '-'}
            </Title>
            <Text as="p" className="mb-2 leading-loose last:mb-0">
              {invoice?.data?.attribute?.form_data?.shipping_address ?? '-'},{' '}
              {invoice?.data?.attribute?.form_data?.province ?? '-'},{' '}
              {invoice?.data?.attribute?.form_data?.city ?? '-'}
            </Text>
          </WidgetCard>
        </div>
      </div>
    </div>
  );
}
