'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { PiShoppingCartSimple } from 'react-icons/pi';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { ProductItem } from '@/types';
import { Button, Title, Text } from 'rizzui';
import { toCurrency } from '@core/utils/to-currency';
import { calculatePercentage } from '@core/utils/calculate-percentage';
import { useCart } from '@/store/quick-cart/cart.context';
import {
  ProductDetailsInput,
  productDetailsSchema,
} from '@/validators/product-details.schema';
import { generateCartProduct } from '@/store/quick-cart/generate-cart-product';
import GetQuantity from './get-quantity';
import BeliSekarangButton from './beli-sekarang-button';
import { routes } from '@/config/routes';
import { useRouter } from 'next/navigation';

export default function ProductDetailsSummery({
  product,
}: {
  product: ProductItem | null;
}) {
  const router = useRouter();
  const { addItemToCart, resetCart } = useCart();
  const [isLoading, setLoading] = useState(false);
  const [isLoadingB, setLoadingB] = useState(false);

  const methods = useForm<ProductDetailsInput>({
    mode: 'onChange',
    // defaultValues: defaultValues(order),
    resolver: zodResolver(productDetailsSchema),
  });

  const { handleSubmit, getValues } = methods;

  const onSubmit = (data: ProductDetailsInput, via: 'cart' | 'checkout') => {
    if (!product) return;

    const item = generateCartProduct({
      ...product,
      quantity: data.quantity,
    });

    if (via === 'checkout') {
      resetCart();
      setLoadingB(true);
      setTimeout(() => {
        setLoadingB(false);
        addItemToCart(item, data.quantity);
        toast.success(
          <Text as="b">Anda akan dialihkan ke halaman Checkout</Text>
        );
        setTimeout(() => router.push(routes.produk.checkout), 300);
      }, 600);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        addItemToCart(item, data.quantity);
        toast.success(<Text as="b">Produk ditambahkan ke keranjang</Text>);
      }, 600);
    }
  };

  return (
    <>
      <div className="border-b border-muted pb-6 @lg:pb-8">
        <Title as="h2" className="mb-2.5 font-bold @6xl:text-4xl">
          {product?.attribute?.name}
        </Title>
        <Text as="p" className="text-base">
          {product?.attribute?.description}
        </Text>
      </div>

      <FormProvider {...methods}>
        <form
          className="pb-8 pt-5"
          onSubmit={handleSubmit((data) => onSubmit(data, 'cart'))}
        >
          <div className="mb-1.5 mt-2 flex items-end font-lexend text-base">
            {(() => {
              const price = product?.attribute?.price?.amount ?? 0;
              const oldPrice = price / (1 - 0.12); // adds roughly 12% back
              return (
                <>
                  <div className="-mb-0.5 text-2xl font-semibold text-gray-900 lg:text-3xl">
                    {toCurrency(price)}
                  </div>
                  {/* <del className="ps-1.5 font-medium text-gray-500">
                    {toCurrency(oldPrice)}
                  </del>
                  <div className="ps-1.5 text-red">
                    ({calculatePercentage(price, oldPrice)}% DISKON)
                  </div> */}
                </>
              );
            })()}
          </div>
          <div className="font-medium text-green-dark">
            Tersedia: {product?.attribute?.stock}
          </div>

          <Title as="h6" className="mb-3.5 mt-6 font-inter text-sm font-medium">
            Masukkan Jumlah
          </Title>

          <GetQuantity stock={product?.attribute?.stock ?? 0} />

          <div className="grid grid-cols-1 gap-4 pt-7 @md:grid-cols-2 @xl:gap-6">
            {/* Bypass checkout */}
            <BeliSekarangButton
              onCheckout={() => onSubmit(getValues(), 'checkout')}
              isLoading={isLoadingB}
            />

            {/* Add to cart (normal submit) */}
            <Button
              variant="outline"
              size="xl"
              type="submit"
              isLoading={isLoading}
              className="h-12 text-sm lg:h-14 lg:text-base"
            >
              <PiShoppingCartSimple className="me-2 h-5 w-5 lg:h-[22px] lg:w-[22px]" />{' '}
              Tambahkan ke Keranjang
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
