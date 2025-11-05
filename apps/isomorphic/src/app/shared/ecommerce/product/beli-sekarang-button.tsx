'use client';

import { useState } from 'react';
import { Button } from 'rizzui';
import cn from '@core/utils/class-names';

export default function BeliSekarangButton({
  className,
}: {
  className?: string;
}) {
  const [favorite, setFavorite] = useState<boolean>(false);
  const [addToWishlistLoader, setAddToWishlistLoader] =
    useState<boolean>(false);

  function addToWishlist() {
    setAddToWishlistLoader(true);
    setFavorite(!favorite);
    setTimeout(() => {
      setAddToWishlistLoader(false);
    }, 1500);
  }
  return (
    <Button
      size="xl"
      onClick={addToWishlist}
      // isLoading={addToWishlistLoader}
      className={cn('h-12 text-sm lg:h-14 lg:text-base', className)}
    >
      Beli Sekarang
    </Button>
  );
}
