import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox } from 'rizzui';

interface DifferentBillingAddressProps {
  className?: string;
}

export default function DifferentBillingAddress({
  className,
}: DifferentBillingAddressProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name="sameShippingAddress"
      control={control}
      render={({ field: { value, onChange } }) => (
        <Checkbox
          value={value}
          defaultChecked={false}
          onChange={onChange}
          label="Ambil di Kantor"
        />
      )}
    />
  );
}
