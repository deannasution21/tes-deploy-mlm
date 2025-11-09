'use client';

import { useFormContext } from 'react-hook-form';
import { Button } from 'rizzui';

export default function BeliSekarangButton({
  onCheckout,
  isLoading,
  disabled,
  className,
}: {
  onCheckout: () => void;
  isLoading?: boolean;
  disabled?: any;
  className?: string;
}) {
  const { formState } = useFormContext(); // optional if you want to check validity

  return (
    <Button
      size="xl"
      className={className}
      isLoading={isLoading}
      onClick={onCheckout}
      disabled={
        disabled ? disabled : !formState.isValid && !formState.isSubmitted
      }
    >
      Beli Sekarang
    </Button>
  );
}
