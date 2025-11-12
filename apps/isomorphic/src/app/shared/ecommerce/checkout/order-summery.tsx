'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { routes } from '@/config/routes';
import usePrice from '@core/hooks/use-price';
import OrderProducts from './order-products';
import { Button, Title, Text } from 'rizzui';
import cn from '@core/utils/class-names';
import { toCurrency } from '@core/utils/to-currency';
import { useCart } from '@/store/quick-cart/cart.context';

export default function OrderSummery({
  isLoading,
  className,
  fee,
}: {
  className?: string;
  isLoading?: boolean;
  fee?: number;
}) {
  const params = useParams();
  const { items, total, addItemToCart, removeItemFromCart, clearItemFromCart } =
    useCart();
  const { price: subtotal } = usePrice(
    items && {
      amount: total,
    }
  );
  const { price: totalPrice } = usePrice({
    amount: total + (fee ?? 0),
  });

  return (
    <div
      className={cn(
        'sticky top-24 mt-8 @5xl:col-span-4 @5xl:mt-0 @6xl:col-span-3 2xl:top-28',
        className
      )}
    >
      <Title as="h4" className="mb-3 font-semibold">
        Pesanan Anda
      </Title>
      <div className="rounded-lg border border-muted p-4 @xs:p-6 @5xl:rounded-none @5xl:border-none @5xl:px-0">
        <div className="flex justify-between rounded-tl-lg rounded-tr-lg border-b border-muted pb-4 @xs:pb-6">
          Produk
          <Link href={routes.produk.index}>
            <Button
              as="span"
              variant="text"
              className="h-auto w-auto p-0 text-primary underline hover:text-gray-1000"
            >
              Kembali ke Pembelian
            </Button>
          </Link>
        </div>
        <div className="pt-4 @xl:pt-6">
          <OrderProducts
            addItemToCart={addItemToCart}
            removeItemFromCart={removeItemFromCart}
            clearItemFromCart={clearItemFromCart}
            items={items}
            className="mb-5 border-b border-muted pb-5"
          />
          <div className="mb-4 flex items-center justify-between last:mb-0">
            Subtotal
            <Text as="span" className="font-medium text-gray-900">
              {subtotal}
            </Text>
          </div>
          <div className="mb-4 flex items-center justify-between last:mb-0">
            Biaya Admin
            <Text as="span" className="font-medium text-gray-900">
              {/* {fee !== 0 ? toCurrency(fee ?? 0) : 'FREE'} */}
              FREE
            </Text>
          </div>
          <div className="mb-4 flex items-center justify-between last:mb-0">
            Pengiriman
            <Text as="span" className="font-medium text-gray-900">
              {/* {toCurrency(0)} */} FREE
            </Text>
          </div>
          <div className="flex items-center justify-between border-t border-muted py-4 text-base font-bold text-gray-1000">
            Total
            <Text>{totalPrice}</Text>
          </div>

          <Text className="text-sm text-green-600 xl:text-base">
            **Diskon (jika ada) akan terlihat di halaman{' '}
            <strong>INVOICE</strong> setelah Anda menekan tombol{' '}
            <strong>BUAT PESANAN</strong> dibawah ini.
          </Text>

          {items.length ? (
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              className="mt-3 w-full text-base @md:h-12"
            >
              {params?.id ? 'Ubah Pesanan' : 'Buat Pesanan'}
            </Button>
          ) : (
            <Link href={routes.eCommerce.shop}>
              <Button
                as="span"
                className="mt-3 w-full text-base @md:h-12"
              >{`Kembali ke Produk`}</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
