'use client';

import { use, useEffect, useState } from 'react';
import {
  useForm,
  useWatch,
  FormProvider,
  type SubmitHandler,
  Controller,
  useFormContext,
} from 'react-hook-form';
import { Text, Input, Button, Select, Textarea, ActionIcon } from 'rizzui';
import { FormBlockWrapper } from '@/app/shared/invoice/form-utils';
import { toast } from 'react-hot-toast';
import WidgetCard from '@core/components/cards/widget-card';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { routes } from '@/config/routes';
import { useRouter } from 'next/navigation';
import { handleSessionExpired } from '@/utils/sessionHandler';
import {
  ProdukFormInput,
  produkFormSchema,
} from '@/validators/produk-form-schema';
import { PiMinusBold, PiPlusBold } from 'react-icons/pi';
import { ProductDetailResponse, ProductItem } from '@/types';

function QuantityInput({
  label,
  name,
  error,
  onChange,
  value,
  disabled,
}: {
  label?: string;
  name?: string;
  error?: string;
  onChange?: (value: number) => void;
  value?: number;
  disabled?: boolean;
}) {
  // Remove max limit, only keep min validation
  const minValue = 1;

  function handleIncrement() {
    if (disabled || value === undefined) return;
    const newValue = (value || minValue) + 1;
    onChange?.(newValue);
  }

  function handleDecrement() {
    if (disabled || value === undefined) return;
    const newValue = Math.max((value || minValue) - 1, minValue);
    onChange?.(newValue);
  }

  function handleOnChange(inputValue: number) {
    if (disabled) return;
    let newValue = Number(inputValue);
    if (isNaN(newValue)) newValue = minValue;
    if (newValue < minValue) newValue = minValue;
    onChange?.(newValue);
  }

  return (
    <Input
      label={label}
      type="number"
      min={minValue}
      name={name}
      value={value ?? minValue}
      placeholder={minValue.toString()}
      disabled={disabled}
      onChange={(e) => handleOnChange(Number(e.target.value))}
      suffix={
        <>
          <ActionIcon
            title="Decrement"
            size="sm"
            variant="outline"
            className="scale-90 shadow-sm"
            disabled={disabled || (value ?? minValue) <= minValue}
            onClick={handleDecrement}
          >
            <PiMinusBold className="h-3.5 w-3.5" strokeWidth={2} />
          </ActionIcon>
          <ActionIcon
            title="Increment"
            size="sm"
            variant="outline"
            className="scale-90 shadow-sm"
            disabled={disabled}
            onClick={handleIncrement}
          >
            <PiPlusBold className="h-3.5 w-3.5" strokeWidth={2} />
          </ActionIcon>
        </>
      }
      suffixClassName="flex gap-1 items-center -me-2"
      error={error}
    />
  );
}

function Formnya({
  isLoading,
  router,
  role,
  typenya,
}: {
  isLoading: boolean;
  router: any;
  role: string;
  typenya: string;
}) {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const tipePlan = [
    {
      value: 'plan_a',
      label: 'Plan Normal',
    },
    {
      value: 'free',
      label: 'Plan Free',
    },
  ];

  return (
    <>
      <div className="flex-grow pb-10">
        <div className="grid grid-cols-1 gap-8 divide-y divide-dashed divide-gray-200 @2xl:gap-10 @3xl:gap-12">
          <FormBlockWrapper title={'Informasi Produk:'}>
            <Input
              label="Nama Produk"
              placeholder="Nama Produk"
              {...register('name')}
              error={errors?.name?.message as any}
            />
            <Controller
              name="plan"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select
                  label="Plan"
                  dropdownClassName="!z-10 h-fit"
                  inPortal={false}
                  placeholder="Pilih Plan"
                  options={tipePlan}
                  onChange={(val) => {
                    onChange(val);
                  }}
                  value={value}
                  getOptionValue={(option) => option.value}
                  displayValue={(selected) =>
                    tipePlan?.find((con) => con.value === selected)?.label ?? ''
                  }
                  error={errors?.plan?.message as string | undefined}
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
              label="Deskripsi"
              placeholder="Deskripsi"
              {...register('description')}
              error={errors.description?.message as string}
              textareaClassName="h-20"
              className="col-span-full"
            />
            <Input
              label="Harga"
              {...register('price')}
              prefix={'Rp'}
              type="number"
              error={errors?.price?.message as string}
            />
            <Controller
              name="stock"
              control={control}
              render={({ field: { name, onChange, value } }) => (
                <QuantityInput
                  label="Stok"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={errors?.stock?.message as string}
                />
              )}
            />
            <Controller
              name="min_order_quantity"
              control={control}
              render={({ field: { name, onChange, value } }) => (
                <QuantityInput
                  label="Min Order"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={errors?.min_order_quantity?.message as string}
                />
              )}
            />
            {/* <Controller
              name="stock_pin"
              control={control}
              render={({ field: { name, onChange, value } }) => (
                <QuantityInput
                  label="PIN Generate"
                  name={name}
                  value={value}
                  onChange={onChange}
                  error={errors?.stock_pin?.message as string}
                />
              )}
            /> */}
          </FormBlockWrapper>
        </div>
      </div>
      <div className="-mb-4 flex items-center justify-end gap-4 border-t py-4 dark:bg-gray-50">
        <Button
          variant="outline"
          className="w-full @xl:w-auto"
          onClick={() => router.push(routes.produk.manajemen.index)}
        >
          Batal
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading}
          className="w-full @xl:w-auto"
        >
          {typenya} Data
        </Button>
      </div>
    </>
  );
}

export default function ProdukFormPage({
  type,
  product_id,
}: {
  type?: string;
  product_id?: string;
}) {
  const { data: session } = useSession();
  const [isLoading, setLoading] = useState(true);
  const [isLoadingS, setLoadingS] = useState(false);

  const [product, setProduct] = useState<ProductItem | null>(null);
  const typenya = type === 'tambah' ? 'Tambah' : 'Edit';

  const router = useRouter();

  const doSave = async (payload: any, reset: any) => {
    if (!session?.accessToken) return;

    setLoadingS(true);

    const url =
      type === 'tambah'
        ? `/_admin-stocks/products`
        : `/_admin-stocks/products/${product_id}`;
    const payloadnya =
      type === 'tambah' ? payload : { ...payload, type: 'detail' };

    fetchWithAuth<any>(
      url,
      {
        method: type === 'tambah' ? 'POST' : 'PUT',
        body: JSON.stringify(payloadnya),
      },
      session.accessToken
    )
      .then((data) => {
        toast.success(
          <Text as="b">
            Data berhasil {type === 'tambah' ? 'ditambahkan' : 'diubah'}
          </Text>
        );
        // if (type === 'tambah') {
        //   reset();
        // } else {
        // }
        router.push(routes.produk.manajemen.index);
      })
      .catch((error) => {
        console.error(error);
        // Clear the data so UI can show "no data"
        toast.error(
          <Text as="b">
            {' '}
            Data gagal {type === 'tambah' ? 'ditambahkan' : 'diubah'}
          </Text>
        );
      })
      .finally(() => setLoadingS(false));
  };

  const methods = useForm({
    defaultValues: {
      name: '',
      plan: 'plan_a',
      price: 50000,
      description: '',
      stock: 1, // jumlah product yg tersedia
      stock_pin: 1, // jumlah pin yg digenerate setiap 1 produk
      min_order_quantity: 1,
    },
    resolver: zodResolver(produkFormSchema),
  });

  const { reset } = methods;

  const onSubmit: SubmitHandler<ProdukFormInput> = (data) => {
    setLoadingS(true);

    Swal.fire({
      title: `Konfirmasi ${typenya} Data`,
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
    }).then((result: any) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        doSave(data, reset);
      } else {
        toast.success(<Text as="b">{typenya} data dibatalkan!</Text>);
        setLoadingS(false);
      }
    });
  };

  useEffect(() => {
    if (!session?.accessToken) {
      handleSessionExpired();
      return;
    }

    setLoading(true);

    if (type === 'edit') {
      fetchWithAuth<ProductDetailResponse>(
        `/_products/${product_id}`,
        { method: 'GET' },
        session.accessToken
      )
        .then((data) => {
          const datanya = data.data;
          setProduct(datanya || null);
          methods.reset({
            name: datanya?.attribute?.name,
            plan: 'plan_a',
            price: datanya?.attribute?.price?.amount,
            description: datanya?.attribute?.description,
            stock: datanya?.attribute?.stock,
            stock_pin: datanya?.attribute?.stock_pin,
            min_order_quantity: datanya?.attribute?.min_order_quantity,
          });
        })
        .catch((error) => {
          console.error(error);
          setProduct(null);
        })
        .finally(() => setLoading(false));
    }

    setLoading(false);
  }, [session?.accessToken]);

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p>Sedang memuat data...</p>
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 3xl:gap-8">
        <WidgetCard
          title={<span className="text-[#c69731]">Form {typenya} Produk</span>}
          titleClassName="text-gray-700 font-bold text-2xl sm:text-2xl font-inter mb-5"
        >
          <div>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Formnya
                  isLoading={isLoadingS}
                  router={router}
                  role={session?.user?.role || 'member'}
                  typenya={typenya}
                />
              </form>
            </FormProvider>
          </div>
        </WidgetCard>
      </div>
    </div>
  );
}
