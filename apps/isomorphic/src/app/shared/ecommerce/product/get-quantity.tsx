'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { ActionIcon, FieldError } from 'rizzui';
import { PiMinusBold, PiPlusBold } from 'react-icons/pi';

export default function GetQuantity({ stock }: { stock: number }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <Controller
        control={control}
        name="quantity"
        defaultValue={1}
        rules={{
          required: 'Quantity is required',
          min: { value: 1, message: 'Minimal 1 item' },
          max: { value: stock, message: `Maksimal ${stock} item` },
        }}
        render={({ field: { value, onChange } }) => {
          const val = value ?? 1;

          const handleIncrement = () => {
            if (val < stock) onChange(val + 1);
          };

          const handleDecrement = () => {
            if (val > 1) onChange(val - 1);
          };

          const handleInputChange = (
            e: React.ChangeEvent<HTMLInputElement>
          ) => {
            const parsed = parseInt(e.target.value, 10);
            if (isNaN(parsed)) return onChange(1);
            onChange(Math.max(1, Math.min(stock, parsed)));
          };

          return (
            <div className="inline-flex items-center rounded-lg border border-muted px-1.5 hover:border-gray-1000">
              <ActionIcon
                title="Decrement"
                size="sm"
                variant="flat"
                className="h-auto px-1 py-[5px]"
                onClick={handleDecrement}
                disabled={val <= 1}
              >
                <PiMinusBold className="h-4 w-4" />
              </ActionIcon>

              <input
                type="number"
                name="quantity"
                min={1}
                max={stock}
                className="h-full w-12 border-none text-center outline-none focus:ring-0 dark:bg-gray-50 sm:w-20"
                value={val}
                onChange={handleInputChange}
              />

              <ActionIcon
                title="Increment"
                size="sm"
                variant="flat"
                className="h-auto px-1 py-1.5"
                onClick={handleIncrement}
                disabled={val >= stock}
              >
                <PiPlusBold className="h-3.5 w-3.5" />
              </ActionIcon>
            </div>
          );
        }}
      />

      {errors?.quantity && (
        <FieldError
          className="mt-1"
          error={errors?.quantity?.message as string}
        />
      )}
    </>
  );
}
