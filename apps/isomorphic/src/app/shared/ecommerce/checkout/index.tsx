'use client';

import {
  useForm,
  useWatch,
  FormProvider,
  type SubmitHandler,
  useFormContext,
  Controller,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import DifferentBillingAddress from '@/app/shared/ecommerce/order/order-form/different-billing-address';
import AddressInfo from '@/app/shared/ecommerce/order/order-form/address-info';
import PaymentMethod from '@/app/shared/ecommerce/checkout/payment-method';
import OrderSummery from '@/app/shared/ecommerce/checkout/order-summery';
import { routes } from '@/config/routes';
import {
  Checkbox,
  Input,
  Radio,
  RadioGroup,
  Select,
  Text,
  Textarea,
  Title,
} from 'rizzui';
import cn from '@core/utils/class-names';
import {
  CreateOrderInput,
  CreateOrderInputNew,
  orderFormSchema,
  orderFormSchemaNew,
} from '@/validators/create-order.schema';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/store/quick-cart/cart.context';
import Swal from 'sweetalert2';
import {
  Districs,
  OptionType,
  PaymentItem,
  PaymentMethodResponse,
  PaymentOption,
  Province,
  Regencies,
  UserData,
  UserDataResponse,
  Villages,
} from '../../../../types';
import { PhoneNumber } from '@core/ui/phone-input';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { CheckoutInput, checkoutSchema } from '@/validators/checkout-.schema';

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

function Formnya({
  className,
  setSelectedProvinceName,
  setSelectedCityName,
  dataPayment,
  setFee,
}: {
  className?: string;
  setSelectedProvinceName?: (value: string) => void;
  setSelectedCityName?: (value: string) => void;
  dataPayment: OptionType[];
  setFee: (value: number) => void;
}) {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  // State for dropdown data
  const [dataProvinsi, setDataProvinsi] = useState<OptionType[]>([]);
  const [dataKabupaten, setDataKabupaten] = useState<OptionType[]>([]);
  const [dataKecamatan, setDataKecamatan] = useState<OptionType[]>([]);
  const [dataKelurahan, setDataKelurahan] = useState<OptionType[]>([]);

  // Watch selected values
  const selectedProvinsi = watch('province');
  const selectedKabupaten = watch('city');
  const selectedKecamatan = watch('kecamatan');
  const shippingMethod = watch('shipping_method');

  // Fetch provinsi list
  useEffect(() => {
    const fetchProvinsi = async () => {
      const res = await fetch('/api/wilayah/provinces');
      const data = (await res.json()) as Province[];
      setDataProvinsi(data.map((p: any) => ({ value: p.id, label: p.name })));
    };
    fetchProvinsi();
  }, []);

  // Fetch kabupaten based on selected provinsi
  useEffect(() => {
    if (!selectedProvinsi) return;

    const fetchKabupaten = async () => {
      const res = await fetch(`/api/wilayah/regencies/${selectedProvinsi}`);
      const data = (await res.json()) as Regencies[];
      setDataKabupaten(data.map((k: any) => ({ value: k.id, label: k.name })));

      // Reset dependent fields
      setValue('kabupaten', '');
      setValue('kecamatan', '');
      setValue('kelurahan', '');
      setDataKecamatan([]);
      setDataKelurahan([]);
    };
    fetchKabupaten();
  }, [selectedProvinsi]);

  // Fetch kecamatan based on selected kabupaten
  useEffect(() => {
    if (!selectedKabupaten) return;

    const fetchKecamatan = async () => {
      const res = await fetch(`/api/wilayah/districts/${selectedKabupaten}`);
      const data = (await res.json()) as Districs[];
      setDataKecamatan(data.map((d: any) => ({ value: d.id, label: d.name })));

      // Reset dependent fields
      setValue('kecamatan', '');
      setValue('kelurahan', '');
      setDataKelurahan([]);
    };
    fetchKecamatan();
  }, [selectedKabupaten]);

  // Fetch kelurahan based on selected kecamatan
  useEffect(() => {
    if (!selectedKecamatan) return;

    const fetchKelurahan = async () => {
      const res = await fetch(`/api/wilayah/villages/${selectedKecamatan}`);
      const data = (await res.json()) as Villages[];
      setDataKelurahan(data.map((v: any) => ({ value: v.id, label: v.name })));

      // Reset kelurahan
      setValue('kelurahan', '');
    };
    fetchKelurahan();
  }, [selectedKecamatan]);

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-1 gap-3 @lg:gap-4 @2xl:gap-5 xl:grid-cols-2',
          className
        )}
      >
        <Title as="h3" className="col-span-full font-semibold">
          Informasi Pengiriman
        </Title>

        <Input
          label="Nama Lengkap"
          placeholder="Nama Lengkap"
          {...register(`customer_name`)}
          // @ts-ignore
          error={errors?.customer_name?.message as any}
          autoComplete="off"
        />
        <Controller
          name="customer_phone"
          control={control}
          render={({ field: { value, onChange } }) => (
            <PhoneNumber
              label="No. HP/WA"
              country="id"
              value={value}
              onChange={onChange}
              // @ts-ignore
              error={errors?.customer_phone?.message as string}
            />
          )}
        />

        <Controller
          name="shipping_method"
          control={control}
          defaultValue="pickup"
          render={({ field: { value, onChange } }) => (
            <div className="col-span-full">
              <RadioGroup
                value={value}
                setValue={onChange}
                className="flex gap-3 xl:gap-5"
              >
                <Radio value="pickup" label="Ambil di Kantor" />
                <Radio value="delivery" label="Kirim ke Alamat di Bawah Ini:" />
              </RadioGroup>
            </div>
          )}
        />

        {shippingMethod === 'delivery' && (
          <>
            {/* Provinsi */}
            <Controller
              control={control}
              name="province"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Provinsi"
                  dropdownClassName="!z-10 h-fit max-h-[250px]"
                  inPortal={false}
                  placeholder="Pilih Provinsi"
                  options={dataProvinsi}
                  onChange={(selectedId) => {
                    const selectedOption = dataProvinsi.find(
                      (p) => p.value === selectedId
                    );
                    onChange(selectedId); // ✅ store ID (used for API chaining)
                    setSelectedProvinceName?.(selectedOption?.label ?? ''); // ✅ store name separately
                  }}
                  value={value}
                  searchable={true}
                  getOptionValue={(option) => option.value}
                  displayValue={(selected) =>
                    dataProvinsi.find((p) => p.value === selected)?.label ?? ''
                  }
                  error={errors?.province?.message as string | undefined}
                />
              )}
            />

            {/* Kabupaten */}
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Kota/Kabupaten"
                  dropdownClassName="!z-10 h-fit max-h-[250px]"
                  inPortal={false}
                  placeholder="Pilih Kabupaten"
                  options={dataKabupaten}
                  onChange={(selectedId) => {
                    const selectedOption = dataKabupaten.find(
                      (p) => p.value === selectedId
                    );
                    onChange(selectedId); // ✅ store ID (used for API chaining)
                    setSelectedCityName?.(selectedOption?.label ?? ''); // ✅ store name separately
                  }}
                  value={value}
                  searchable={true}
                  getOptionValue={(option) => option.value}
                  displayValue={(selected) =>
                    dataKabupaten.find((k) => k.value === selected)?.label ?? ''
                  }
                  error={errors?.city?.message as string | undefined}
                  disabled={!selectedProvinsi}
                />
              )}
            />

            {/* Kecamatan */}
            <Controller
              control={control}
              name="kecamatan"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Kecamatan"
                  dropdownClassName="!z-10 h-fit max-h-[250px]"
                  inPortal={false}
                  placeholder="Pilih Kecamatan"
                  options={dataKecamatan}
                  onChange={onChange}
                  value={value}
                  searchable={true}
                  getOptionValue={(option) => option.value}
                  displayValue={(selected) =>
                    dataKecamatan.find((d) => d.value === selected)?.label ?? ''
                  }
                  error={errors?.kecamatan?.message as string | undefined}
                  disabled={!selectedKabupaten}
                />
              )}
            />

            {/* Kelurahan */}
            <Controller
              control={control}
              name="kelurahan"
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Kelurahan"
                  dropdownClassName="!z-10 h-fit max-h-[250px]"
                  inPortal={false}
                  placeholder="Pilih Kelurahan"
                  options={dataKelurahan}
                  onChange={onChange}
                  value={value}
                  searchable={true}
                  getOptionValue={(option) => option.value}
                  displayValue={(selected) =>
                    dataKelurahan.find((v) => v.value === selected)?.label ?? ''
                  }
                  error={errors?.kelurahan?.message as string | undefined}
                  disabled={!selectedKecamatan}
                />
              )}
            />
            <style>
              {`
    textarea:-webkit-autofill {
      border-color: inherit !important;
    }
  `}
            </style>

            <Textarea
              label="Alamat"
              placeholder="Alamat"
              {...register('shipping_address')}
              error={errors.shipping_address?.message as string}
              textareaClassName="h-20"
            />
          </>
        )}

        {/* <Controller
          name="shippingMethod"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Checkbox
              value={value}
              defaultChecked={false}
              onChange={onChange}
              label="Ambil di Kantor"
              className="mt-6"
            />
          )}
        /> */}
      </div>

      <div>
        <Title as="h4" className="mb-3.5 font-semibold @2xl:mb-5">
          Metode Pembayaran
        </Title>
        <div className="space-y-4 [&_label]:block">
          <Controller
            control={control}
            name="payment_method"
            render={({ field: { onChange, value } }) => (
              <Select
                label="Pilih Metode Pembayaran"
                dropdownClassName="z-[9999] bg-white h-fit max-h-[250px]"
                inPortal={false}
                placeholder="Pilih Metode Pembayaran"
                options={dataPayment}
                onChange={(selectedValue) => {
                  // 🔹 Update form field value
                  onChange(selectedValue);

                  // 🔹 Find the selected option
                  const selected: any = dataPayment.find(
                    (opt) => opt.value === selectedValue
                  );

                  setFee?.(selected?.fee ?? 0);
                }}
                value={value}
                searchable={true}
                getOptionValue={(option) => option.value}
                displayValue={(selected) =>
                  dataPayment.find((k) => k.value === selected)?.label ?? ''
                }
                error={errors?.payment_method?.message as string | undefined}
              />
            )}
          />
        </div>
      </div>
    </>
  );
}

// main order form component for create and update order
export default function CheckoutPageWrapper({
  className,
}: {
  className?: string;
}) {
  const [isLoading, setLoading] = useState(true);
  const [isLoadingS, setLoadingS] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  const [dataUser, setDataUser] = useState<UserData | null>(null);
  const [dataPayment, setDataPayment] = useState<PaymentOption[]>([]);
  const { items, resetCart } = useCart();
  const [fee, setFee] = useState(0);
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>('');
  const [selectedCityName, setSelectedCityName] = useState<string>('');

  const methods = useForm({
    defaultValues: {
      shipping_method: 'pickup',
    },
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
  });

  const createInvoice = async (payload: any) => {
    if (!session?.accessToken) return;

    setLoadingS(true);

    // ✅ Transform items → products payload
    const products = items.map((item) => ({
      id: item.id?.toLowerCase(),
      quantity: item.quantity,
    }));

    const body =
      payload?.shipping_method === 'pickup'
        ? JSON.stringify({
            username: session?.user?.id,
            customer_name: payload?.customer_name,
            customer_phone: payload?.customer_phone,
            shipping_method: 'AMBIL DI KANTOR',
            products: products,
            note: '',
            payment_method: payload?.payment_method,
            type: 'payment',
          })
        : JSON.stringify({
            username: session?.user?.id,
            customer_name: payload?.customer_name,
            customer_phone: payload?.customer_phone,
            shipping_method: 'PENGIRIMAN BIASA',
            shipping_address: payload?.shipping_address,
            province: selectedProvinceName,
            city: selectedCityName,
            products: products,
            note: '',
            payment_method: payload?.payment_method,
            type: 'payment',
          });

    fetchWithAuth<PaymentTransactionResponse>(
      `/_transactions`,
      {
        method: 'POST',
        body: body,
      },
      session.accessToken
    )
      .then((data) => {
        toast.success(<Text as="b">Pesanan berhasil dibuat</Text>);
        resetCart();
        const invoiceID = data?.data?.id;
        router.push(routes.produk.pesanan.detail(invoiceID));
      })
      .catch((error) => {
        console.error(error);
        // Clear the data so UI can show "no data"
        toast.error(<Text as="b">Terjadi kesalahan saat membuat pesanan</Text>);
        setLoadingS(false);
      });
  };

  const onSubmit: SubmitHandler<CheckoutInput> = (data) => {
    // set timeout ony required to display loading state of the create order button
    setLoadingS(true);

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
        createInvoice(data);
      } else {
        setLoadingS(false);
        toast.success(<Text as="b">Pesanan dibatalkan!</Text>);
      }
    });
  };

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    Promise.all([
      fetchWithAuth<UserDataResponse>(
        `/_users`,
        { method: 'GET' },
        session.accessToken
      ),
      fetchWithAuth<PaymentMethodResponse>(
        `/_services/payment-method`,
        { method: 'GET' },
        session.accessToken
      ),
    ])
      .then(([usersData, paymentData]) => {
        const userData = usersData?.data?.attribute;
        setDataUser(userData || null);

        if (paymentData?.data) {
          const options: PaymentOption[] = [];

          // VA methods
          if (Array.isArray(paymentData.data.va)) {
            paymentData.data.va.forEach((item: PaymentItem) => {
              options.push({
                value: item.id,
                label: `Virtual Account - ${item.payment_channel.toUpperCase()}`,
                fee: item.fee.value,
              });
            });
          }

          // QRIS / wallet
          if (Array.isArray(paymentData.data.qris)) {
            paymentData.data.qris.forEach((item: PaymentItem) => {
              options.push({
                value: item.id,
                label: `${item.payment_channel.toUpperCase()}`,
                fee: item.fee.value,
              });
            });
          }

          setDataPayment(options);
        }
      })
      .catch((error) => {
        console.error(error);
        setDataUser(null);
        setDataPayment([]);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p>Sedang memuat data...</p>
      </div>
    );
  }

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
              <Formnya
                setSelectedProvinceName={setSelectedProvinceName}
                setSelectedCityName={setSelectedCityName}
                dataPayment={dataPayment}
                setFee={setFee}
              />
            </div>
          </div>

          <OrderSummery isLoading={isLoadingS} fee={fee} />
        </div>
      </form>
    </FormProvider>
  );
}
