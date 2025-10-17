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

// types.ts
export interface PaymentOption {
  value: string;
  label: string;
  icon: string;
}

export const dataMetodePembayaran: PaymentOption[] = [
  {
    value: 'bca_va',
    label: 'BCA Virtual Account',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/BCA_logo.svg',
  },
  {
    value: 'bni_va',
    label: 'BNI Virtual Account',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/BNI_logo.svg',
  },
  {
    value: 'bri_va',
    label: 'BRI Virtual Account',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Bank_BRI_logo.svg',
  },
  {
    value: 'mandiri_va',
    label: 'Mandiri Virtual Account',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Bank_Mandiri_logo.svg',
  },
  {
    value: 'qris',
    label: 'QRIS',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Logo_QRIS.svg',
  },
  {
    value: 'gopay',
    label: 'GoPay',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/4/46/GoPay_logo.svg',
  },
  {
    value: 'ovo',
    label: 'OVO',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Logo_ovo_purple.svg',
  },
  {
    value: 'dana',
    label: 'DANA',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Logo_dana_blue.svg',
  },
  {
    value: 'shopeepay',
    label: 'ShopeePay',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/ShopeePay_logo.svg',
  },
  {
    value: 'credit_card',
    label: 'Kartu Kredit / Debit',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
  },
];

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
          name="payment_method"
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
              error={errors?.payment_method?.message as string | undefined}
            />
          )}
        />
      </div>
    </div>
  );
}
