'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { PhoneNumber } from '@core/ui/phone-input';
import { Input, Select, Textarea, Title } from 'rizzui';
import cn from '@core/utils/class-names';
import { useEffect, useState } from 'react';

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

export default function AddressInfo({
  type,
  title,
  className,
  setSelectedProvinceName,
  setSelectedCityName,
}: AddressInfoProps) {
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
    <div
      className={cn(
        'grid grid-cols-1 gap-3 @lg:gap-4 @2xl:gap-5 xl:grid-cols-2',
        className
      )}
    >
      {title && (
        <Title as="h3" className="col-span-full font-semibold">
          {title}
        </Title>
      )}

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
            dropdownClassName="!z-10 h-fit"
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
            dropdownClassName="!z-10 h-fit"
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
            dropdownClassName="!z-10 h-fit"
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
            dropdownClassName="!z-10 h-fit"
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
      <Input
        label="Kode Pos"
        placeholder="Kode Pos"
        {...register(`zip`)}
        // @ts-ignore
        error={errors?.zip?.message as string}
      />
    </div>
  );
}
