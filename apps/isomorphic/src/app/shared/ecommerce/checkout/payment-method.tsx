'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import {
  Input,
  Title,
  Text,
  Checkbox,
  Collapse,
  AdvancedRadio,
  RadioGroup,
  NumberInput,
  NumberInputProps,
  Select,
} from 'rizzui';
import cn from '@core/utils/class-names';
import { usePatternFormat } from '@core/hooks/use-pattern-format';
import {
  PiCaretDownBold,
  PiCheckCircleFill,
  PiLockKeyLight,
} from 'react-icons/pi';
import { paymentMethodData } from '@/data/checkout-data';

type CardExpiredType = NumberInputProps & {
  isMask?: boolean;
};

function CardExpired({ isMask = false, ...props }: CardExpiredType) {
  const { format } = usePatternFormat({
    ...props,
    format: '##/##',
  });
  const _format = (val: string) => {
    let month = val.substring(0, 2);
    const year = val.substring(2, 4);

    if (month.length === 1 && parseInt(month[0]) > 1) {
      month = `0${month[0]}`;
    } else if (month.length === 2) {
      if (Number(month) === 0) {
        month = '01';
      } else if (Number(month) > 12) {
        month = '12';
      }
    }
    return isMask && format ? format(`${month}${year}`) : `${month}/${year}`;
  };
  return <NumberInput {...props} format={_format} />;
}

export default function PaymentMethod({ className }: { className?: string }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const [collapseOpen, setCollapseOpen] = useState(true);

  const paymentMethod = useWatch({
    control,
    name: 'paymentMethod',
  });

  // ✅ Adjusted dummy data for "metode pembayaran"
  async function fetchDataMetodePembayaran() {
    const raw = [
      {
        group: 'Bank Transfer',
        items: [
          { id: 'bni', text: 'BNI - 123456' },
          { id: 'bri', text: 'BRI - 123456' },
          { id: 'bca', text: 'BCA - 123456' },
          { id: 'mandiri', text: 'MANDIRI - 123456' },
        ],
      },
      {
        group: 'Virtual Account',
        items: [
          { id: 'va_bni', text: 'BNI VA - 123456' },
          { id: 'va_bri', text: 'BRI VA - 123456' },
          { id: 'va_bca', text: 'BCA VA - 123456' },
          { id: 'va_mandiri', text: 'MANDIRI VA - 123456' },
        ],
      },
    ];

    // ✅ Map into your select-friendly structure
    const formatted = raw.flatMap((group) =>
      group.items.map((item) => ({
        label: `${group.group} — ${item.text}`,
        value: item.id,
      }))
    );

    return formatted;
  }

  const [dataMetodePembayaran, setDataMetodePembayaran] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    fetchDataMetodePembayaran().then(setDataMetodePembayaran);
  }, []);

  return (
    <div>
      <Title as="h4" className="mb-3.5 font-semibold @2xl:mb-5">
        Metode Pembayaran
      </Title>
      <div className="space-y-4 [&_label]:block">
        {/* <Controller
          name="paymentMethod"
          control={control}
          render={({ field: { value, onChange } }) => (
            <RadioGroup
              value={value}
              setValue={(e) => {
                onChange(e);
                setCollapseOpen(false);
              }}
              className="grid gap-4"
            >
              {paymentMethodData.map((item) => (
                <AdvancedRadio
                  key={item.id}
                  name="paymentMethod"
                  value={item.value}
                  checked={item.value === paymentMethod ? true : false}
                  inputClassName="[&~span]:border-0 [&~span]:ring-1 [&~span]:ring-gray-200 [&~span:hover]:ring-primary [&:checked~span:hover]:ring-primary [&:checked~span]:border-1 [&:checked~.rizzui-advanced-checkbox]:ring-2"
                >
                  <span className="flex flex-col gap-4 py-6 ps-3.5 @md:flex-row @md:items-center @md:gap-6">
                    <span className="inline-flex @md:shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        height={60}
                        width={80}
                        className="object-contain"
                      />
                    </span>
                    <span className="block">
                      <Title
                        as="h6"
                        className="mb-2.5 block text-base font-medium @md:mb-2"
                      >
                        {item.name}
                      </Title>
                      <Text
                        as="span"
                        className="block font-normal leading-[1.85] @md:pe-10"
                      >
                        {item.description}
                      </Text>
                    </span>
                  </span>
                  <PiCheckCircleFill className="icon absolute right-4 top-4 hidden h-6 w-6 text-primary @xs:right-6 @xs:top-6 rtl:left-4 rtl:right-auto @xs:rtl:left-6" />
                </AdvancedRadio>
              ))}
            </RadioGroup>
          )}
        /> */}
        <Controller
          control={control}
          name="metode"
          render={({ field: { onChange, value } }) => (
            <Select
              label="Pilih Metode Pembayaran"
              dropdownClassName="!z-10"
              inPortal={false}
              placeholder="Pilih Metode Pembayaran"
              options={dataMetodePembayaran}
              onChange={onChange}
              value={value}
              searchable={true}
              getOptionValue={(option) => option.value}
              displayValue={(selected) =>
                dataMetodePembayaran.find((k) => k.value === selected)?.label ??
                ''
              }
              error={'Kolom wajib diisi'}
            />
          )}
        />
      </div>
    </div>
  );
}
