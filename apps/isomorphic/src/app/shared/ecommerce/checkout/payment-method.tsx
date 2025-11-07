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

export interface PaymentMethodResponse {
  code: number;
  success: boolean;
  message: string;
  data: PaymentData;
}

export interface PaymentData {
  va: PaymentItem[];
  qris: PaymentItem[];
}

export interface PaymentItem {
  id: string;
  payment_method: string; // e.g. "virtual_account", "wallet_account"
  payment_channel: string; // e.g. "bca", "bni", "qris"
  percentage_type: 'fix' | 'percentage';
  fee: PaymentFee;
}

export interface PaymentFee {
  value: number;
  formatted: string; // e.g. "Rp 3.000,00" or "0.7%"
}

interface PaymentMethod {
  id: string;
  payment_method: string;
  payment_channel: string;
  percentage_type: string;
  fee: {
    value: number;
    formatted: string;
  };
}

interface PaymentOption {
  value: string;
  label: string;
  fee?: number;
}

export default function PaymentMethod({
  token,
  setFee,
}: {
  token?: string;
  setFee?: (value: number) => void;
}) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const paymentMethod = useWatch({
    control,
    name: 'paymentMethod',
  });

  const [dataMetodePembayaran, setDataMetodePembayaran] = useState<
    PaymentOption[]
  >([]);

  useEffect(() => {
    const fetchMetodePembayaran = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/_services/payment-method`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-app-token': token ?? '',
            },
          }
        );

        if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
        const data = (await res.json()) as PaymentMethodResponse;

        if (data?.data) {
          const options: PaymentOption[] = [];

          // VA methods
          if (Array.isArray(data.data.va)) {
            data.data.va.forEach((item) => {
              options.push({
                value: item.id,
                label: `Virtual Account - ${item.payment_channel.toUpperCase()}`,
                fee: item.fee.value,
              });
            });
          }

          // QRIS / wallet
          if (Array.isArray(data.data.qris)) {
            data.data.qris.forEach((item) => {
              options.push({
                value: item.id,
                label: `${item.payment_channel.toUpperCase()}`,
                fee: item.fee.value,
              });
            });
          }

          setDataMetodePembayaran(options);
        }
      } catch (err) {
        console.error('Failed to fetch payment methods:', err);
      }
    };

    fetchMetodePembayaran();
  }, [token]);

  return (
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
              dropdownClassName="!z-10 h-fit"
              inPortal={false}
              placeholder="Pilih Metode Pembayaran"
              options={dataMetodePembayaran}
              onChange={(selectedValue) => {
                // 🔹 Update form field value
                onChange(selectedValue);

                // 🔹 Find the selected option
                const selected = dataMetodePembayaran.find(
                  (opt) => opt.value === selectedValue
                );

                setFee?.(selected?.fee ?? 0);
              }}
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
