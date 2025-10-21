'use client';

import {
  useForm,
  useWatch,
  FormProvider,
  type SubmitHandler,
} from 'react-hook-form';
import { useSetAtom } from 'jotai';
import toast from 'react-hot-toast';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import DifferentBillingAddress from '@/app/shared/ecommerce/order/order-form/different-billing-address';
import { orderData } from '@/app/shared/ecommerce/order/order-form/form-utils';
import AddressInfo from '@/app/shared/ecommerce/order/order-form/address-info';
import ShippingMethod from '@/app/shared/ecommerce/checkout/shipping-method';
import PaymentMethod from '@/app/shared/ecommerce/checkout/payment-method';
import OrderSummery from '@/app/shared/ecommerce/checkout/order-summery';
import OrderNote from '@/app/shared/ecommerce/checkout/order-note';
import { DUMMY_ID } from '@/config/constants';
import { routes } from '@/config/routes';
import { Text } from 'rizzui';
import cn from '@core/utils/class-names';
import {
  billingAddressAtom,
  orderNoteAtom,
  shippingAddressAtom,
} from '@/store/checkout';
import {
  CreateOrderInput,
  CreateOrderInputNew,
  orderFormSchema,
  orderFormSchemaNew,
} from '@/validators/create-order.schema';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/store/quick-cart/cart.context';
import Swal from 'sweetalert2';

export interface PaymentTransactionResponse {
  code: number;
  success: boolean;
  message: string;
  data: {
    type: string;
    url: string;
    id: string;
    attribute: TransactionAttribute;
  };
}

export interface TransactionAttribute {
  transaction_id: string;
  refference_id: string;
  customer: CustomerInfo;
  payment: PaymentInfo;
  bill_payment: BillPaymentInfo;
  metadata: PaymentMetadata;
  form_data: FormDataInfo;
  status: TransactionStatus;
  waktu: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
}

export interface PaymentInfo {
  gateway: string;
  payment_method: string;
  payment_channel: string;
  payment_name: string;
  payment_number: string;
  expired_at: string;
}

export interface BillPaymentInfo {
  sub_total: NominalInfo;
  fee: NominalInfo;
  total: NominalInfo;
}

export interface NominalInfo {
  nominal: string;
  nominal_rp: string;
}

export interface PaymentMetadata {
  qr_string: string | null;
  qr_image: string | null;
  qr_template: string | null;
  qr_image_encoded: string | null;
  terminal: string | null;
  nns_code: string | null;
  nmid: string | null;
}

export interface FormDataInfo {
  username: string;
  customer_name: string;
  customer_phone: string;
  shipping_method: string;
  shipping_address: string;
  province: string;
  city: string;
  note: string | null;
  products: ProductInfo[];
}

export interface ProductInfo {
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

// main order form component for create and update order
export default function CheckoutPageWrapper({
  className,
}: {
  className?: string;
}) {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const session = useSession();
  const token = session?.data?.accessToken ?? undefined;
  const { items } = useCart();
  const [fee, setFee] = useState(0);
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>('');
  const [selectedCityName, setSelectedCityName] = useState<string>('');
  const setOrderNote = useSetAtom(orderNoteAtom);
  const setBillingAddress = useSetAtom(billingAddressAtom);
  const setShippingAddress = useSetAtom(shippingAddressAtom);

  const methods = useForm({
    mode: 'onChange',
    resolver: zodResolver(orderFormSchemaNew),
  });

  const sameShippingAddress = useWatch({
    control: methods.control,
    name: 'sameShippingAddress',
  });

  const onSubmit: SubmitHandler<CreateOrderInputNew> = (data) => {
    // set timeout ony required to display loading state of the create order button
    setLoading(true);

    // ✅ Transform items → products payload
    const products = items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    const createInvoice = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/_transactions`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-app-token': token ?? '',
            },
            body: JSON.stringify({
              username: session?.data?.user?.id,
              customer_name: data?.customer_name,
              customer_phone: data?.customer_phone,
              shipping_method: data?.shipping_method
                ? 'AMBIL DI KANTOR'
                : 'PENGIRIMAN BIASA',
              shipping_address: data?.shipping_address,
              province: selectedProvinceName,
              city: selectedCityName,
              products: products,
              note: '',
              payment_method: data?.payment_method,
              type: 'payment',
            }),
          }
        );

        if (!res.ok) throw new Error(`HTTP error! ${res.status}`);

        const response = (await res.json()) as PaymentTransactionResponse;

        if (response?.success && response?.data) {
          const invoiceID = response?.data?.id;
          router.push(routes.produk.pesanan.detail(invoiceID));
          toast.success(<Text as="b">Pesanan berhasil dibuat!</Text>);
        }
      } catch (error) {
        setLoading(false);
        console.error('Fetch data error:', error);
        toast.error(
          <Text as="b">Terjadi kesalahan saat membuat pesanan.</Text>
        );
      }
    };

    Swal.fire({
      title: 'Konfirmasi Pesanan',
      html: 'Harap pastikan data yang Anda masukkan benar. Jika sudah silakan <strong>LANJUTKAN</strong>',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Lanjutkan',
      cancelButtonText: 'Batal',
      customClass: {
        confirmButton:
          'bg-[#AA8453] hover:bg-[#a16207] text-white font-semibold px-4 py-2 rounded me-3', // 👈 your custom class here
        cancelButton:
          'bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded',
      },
      buttonsStyling: false, // 👈 important! disable default styling
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        createInvoice();
      } else if (result.isDenied) {
        setLoading(false);
        toast.success(<Text as="b">Pesanan dibatalkan!</Text>);
      }
    });

    // setTimeout(() => {
    //   setLoading(false);
    //   console.log('checkout_data', data);
    //   // router.push(routes.eCommerce.orderDetails(DUMMY_ID));
    //   toast.success(<Text as="b">Order placed successfully!</Text>);
    // }, 600);
  };

  // console.log('errors', methods.formState.errors);

  return (
    <FormProvider {...methods}>
      <form
        // @ts-ignore
        onSubmit={methods.handleSubmit(onSubmit)}
        className={cn(
          'isomorphic-form isomorphic-form mx-auto flex w-full max-w-[1536px] flex-grow flex-col @container [&_label.block>span]:font-medium',
          className
        )}
      >
        <div className="items-start @5xl:grid @5xl:grid-cols-12 @5xl:gap-7 @6xl:grid-cols-10 @7xl:gap-10">
          <div className="gap-4 border-muted @container @5xl:col-span-8 @5xl:border-e @5xl:pb-12 @5xl:pe-7 @6xl:col-span-7 @7xl:pe-12">
            <div className="flex flex-col gap-4 @xs:gap-7 @5xl:gap-9">
              <AddressInfo
                type="billingAddress"
                title="Informasi Pembayaran"
                setSelectedProvinceName={setSelectedProvinceName}
                setSelectedCityName={setSelectedCityName}
              />

              <DifferentBillingAddress />

              <PaymentMethod token={token} setFee={setFee} />
            </div>
          </div>

          <OrderSummery isLoading={isLoading} fee={fee} />
        </div>
      </form>
    </FormProvider>
  );
}
