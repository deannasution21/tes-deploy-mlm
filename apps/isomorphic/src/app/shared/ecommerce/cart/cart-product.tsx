import Link from 'next/link';
import Image from 'next/image';
import { ProductCartItem } from '@/types';
import { toCurrency } from '@core/utils/to-currency';
import { Title, Text } from 'rizzui';
import { AddToWishList } from '@core/components/wishlist-button';
import RemoveItem from '@/app/shared/ecommerce/cart/remove-item';
import QuantityInput from '@/app/shared/ecommerce/cart/quantity-input';
import { routes } from '@/config/routes';

export default function CartProduct({ product }: { product: ProductCartItem }) {
  return (
    <div className="grid grid-cols-12 items-start gap-4 border-b border-muted py-6 first:pt-0 sm:flex sm:gap-6 2xl:py-8">
      <figure className="col-span-4 sm:max-w-[180px]">
        <Image
          src={product.image}
          alt={product.name}
          width={180}
          height={180}
          className="aspect-square w-full rounded-lg bg-gray-100 object-cover"
        />
      </figure>
      <div className="col-span-8 sm:block sm:w-full">
        <div className="flex flex-col-reverse gap-1 sm:flex-row sm:items-center sm:justify-between">
          <Title
            as="h3"
            className="truncate text-base font-medium transition-colors hover:text-primary 3xl:text-lg"
          >
            <Link
              href={routes.eCommerce.productDetails(product?.slug as string)}
            >
              {product.name}
            </Link>
          </Title>
          <span className="inline-block text-sm font-semibold text-gray-1000 sm:font-medium md:text-base 3xl:text-lg">
            {toCurrency(product.price?.amount)}
          </span>
        </div>
        <Text className="mt-1 w-full max-w-xs truncate leading-6 2xl:max-w-lg">
          {product.description}
        </Text>

        <div className="mt-3 hidden items-center justify-between xs:flex sm:mt-6">
          <QuantityInput product={product} />
          <div className="flex items-center gap-4">
            <RemoveItem productID={product.id} placement="bottom-end" />
          </div>
        </div>
      </div>
      <div className="col-span-full flex items-center justify-between xs:hidden">
        <div className="flex items-center gap-4">
          <RemoveItem productID={product.id} placement="bottom-start" />
        </div>
        <QuantityInput product={product} />
      </div>
    </div>
  );
}
