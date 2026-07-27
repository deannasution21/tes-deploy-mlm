'use client';

import { useEffect, useState } from 'react';
import Image, { ImageProps, StaticImageData } from 'next/image';
import { getProductImageById } from '../../../../apps/isomorphic/src/utils/get-product-image';

interface ProductImageProps extends Omit<ImageProps, 'src'> {
  src?: string | StaticImageData | null;
  productId?: string | number | null;
}

export default function ProductImage({
  src,
  productId,
  ...rest
}: ProductImageProps) {
  const fallback = getProductImageById(
    productId === null || productId === undefined ? undefined : String(productId)
  );

  const [currentSrc, setCurrentSrc] = useState<string | StaticImageData>(
    src || fallback
  );

  useEffect(() => {
    setCurrentSrc(src || fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, productId]);

  return (
    <Image {...rest} src={currentSrc} onError={() => setCurrentSrc(fallback)} />
  );
}
