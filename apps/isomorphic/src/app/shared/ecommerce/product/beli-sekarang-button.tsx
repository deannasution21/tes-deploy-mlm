'use client';

import { useFormContext } from 'react-hook-form';
import { Button } from 'rizzui';

export default function BeliSekarangButton({
  onCheckout,
  isLoading,
  className,
}: {
  onCheckout: () => void;
  isLoading?: boolean;
  className?: string;
}) {
  const { formState } = useFormContext(); // optional if you want to check validity

  return (
    <Button
      size="xl"
      className={className}
      isLoading={isLoading}
      onClick={onCheckout}
      disabled={!formState.isValid && !formState.isSubmitted}
    >
      Beli Sekarang
    </Button>
  );
}
