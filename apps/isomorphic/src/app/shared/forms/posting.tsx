'use client';

import {
  useForm,
  useWatch,
  FormProvider,
  type SubmitHandler,
  Controller,
  useFormContext,
} from 'react-hook-form';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import DifferentBillingAddress from '@/app/shared/ecommerce/order/order-form/different-billing-address';
import { defaultValues } from '@/app/shared/ecommerce/order/order-form/form-utils';
import CustomerInfo from '@/app/shared/ecommerce/order/order-form/customer-info';
import AddressInfo from '@/app/shared/ecommerce/order/order-form/address-info';
import { Input, Select, Text, Textarea, Title } from 'rizzui';
import cn from '@core/utils/class-names';
import OrderSummery from '@/app/shared/ecommerce/checkout/order-summery';
import OrderNote from '@/app/shared/ecommerce/checkout/order-note';
import {
  CreateOrderInput,
  orderFormSchema,
} from '@/validators/create-order.schema';
import { PhoneNumber } from '@core/ui/phone-input';

interface AddressInfoProps {
  type: string;
  title?: string;
  className?: string;
  setSelectedProvinceName?: (value: string) => void;
  setSelectedCityName?: (value: string) => void;
}

interface OptionType {
  value: string;
  label: string;
}

interface Province {
  id: string;
  name: string;
}

interface Regencies {
  id: string;
  province_id: string;
  name: string;
}

interface Districs {
  id: string;
  regency_id: string;
  name: string;
}

interface Villages {
  id: string;
  district_id: string;
  name: string;
}

function Formnya() {
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
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>('');
  const [selectedCityName, setSelectedCityName] = useState<string>('');

  // Watch selected values
  const selectedProvinsi = watch('province');
  const selectedKabupaten = watch('city');
  const selectedKecamatan = watch('kecamatan');

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
      <div className={cn('grid grid-cols-2 gap-3 @lg:gap-4 @2xl:gap-5')}>
        <Title as="h3" className="col-span-full font-semibold">
          Form Posting
        </Title>

        <Input
          label="Nama Lengkap"
          placeholder="Nama Lengkap"
          {...register(`customer_name`)}
          // @ts-ignore
          error={errors?.customer_name?.message as any}
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
        {/* Provinsi */}
        <Controller
          control={control}
          name="province"
          render={({ field: { onChange, value } }) => (
            <Select
              label="Provinsi"
              dropdownClassName="!z-10"
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
              dropdownClassName="!z-10"
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
              error={errors?.kabupaten?.message as string | undefined}
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
              dropdownClassName="!z-10"
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
              dropdownClassName="!z-10"
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
        <Textarea
          label="Alamat"
          placeholder="Alamat"
          {...register('shipping_address')}
          error={errors.shipping_address?.message as string}
          textareaClassName="h-20"
        />
        <Input
          label="Kode Pos"
          placeholder="Kode Pos"
          {...register(`zip`)}
          // @ts-ignore
          error={errors?.zip?.message as string}
        />
      </div>
      <div className={cn('border-t border-muted pt-4 @xs:pt-6 @5xl:pt-7')}>
        <Title as="h4" className="col-span-full font-semibold">
          Informasi Rekening Bank
        </Title>
        <Textarea
          label="Order Note (optional)"
          placeholder="Notes about your order, e.g. special notes for delivery."
          {...register('note')}
          error={errors.note?.message as string}
          textareaClassName="h-20"
        />
      </div>
    </>
  );
}

function Informasi() {
  return (
    <div
      className={cn(
        'pb-7 pt-10 @container @5xl:col-span-4 @5xl:py-0 @6xl:col-span-3'
      )}
    >
      <div className="rounded-xl border border-gray-300 p-5 @sm:p-6 @md:p-7">
        <div className="relative border-b border-gray-300 pb-7">
          <Title as="h6" className="mb-6">
            Informasi Penting!
          </Title>
          <div className="flex">
            <div className="ps-4 @5xl:ps-6">
              <Title as="h6" className="mb-2.5 font-semibold">
                Leslie Alexander
              </Title>
              <Text as="p" className="mb-2 break-all last:mb-0">
                nevaeh.simmons@example.com
              </Text>
              <Text as="p" className="mb-2 last:mb-0">
                (316) 555-0116
              </Text>
            </div>
          </div>
        </div>
        <div className="relative mb-7 border-b border-gray-300 py-7">
          <Title as="h6">Order Details</Title>
          <Text
            as="p"
            className="mt-3 flex flex-col font-semibold text-gray-700"
          >
            <span className="mb-2 font-normal">Order ID</span> COMP1502
          </Text>
        </div>
      </div>
    </div>
  );
}

// main order form component for create and update order
export default function Posting({
  id,
  order,
  className,
}: {
  id?: string;
  className?: string;
  order?: CreateOrderInput;
}) {
  const [isLoading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: defaultValues(order),
    resolver: zodResolver(orderFormSchema),
  });

  const onSubmit: SubmitHandler<CreateOrderInput> = (data) => {
    // console.log('data', data);

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      console.log('posting data ->', data);
      // router.push(routes.eCommerce.orderDetails(DUMMY_ID));
      toast.success(
        <Text as="b">Posting {id ? 'Updated' : 'placed'} berhasil!</Text>
      );
    }, 600);
  };

  return (
    <FormProvider {...methods}>
      <form
        // @ts-ignore
        onSubmit={methods.handleSubmit(onSubmit)}
        className={cn(
          'isomorphic-form flex flex-grow flex-col @container [&_label.block>span]:font-medium',
          className
        )}
      >
        <div className="items-start @5xl:grid @5xl:grid-cols-12 @5xl:gap-7 @6xl:grid-cols-10 @7xl:gap-10">
          <div className="flex-grow @5xl:col-span-8 @5xl:pb-10 @6xl:col-span-7">
            <div className="flex flex-col gap-4 @xs:gap-7 @5xl:gap-9">
              <Formnya />
            </div>
          </div>

          <div className="pb-7 pt-10 @container @5xl:col-span-4 @5xl:py-0 @6xl:col-span-3">
            <Informasi />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
