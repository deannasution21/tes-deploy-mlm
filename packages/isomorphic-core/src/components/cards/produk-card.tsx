"use client";
import Image, { StaticImageData } from "next/image";
import { Title, Text } from "rizzui";
import cn from "../../utils/class-names";
import { ProductItem } from "../../../../../apps/isomorphic/src/types";
import { toCurrency } from "../../utils/to-currency";
import { generateSlug } from "@core/utils/generate-slug";
import Link from "next/link";
import { calculatePercentage } from "@core/utils/calculate-percentage";

interface ProductProps {
  product: ProductItem;
  image: string | StaticImageData;
  className?: string;
  routes: any;
}

export default function ProdukCard({
  product,
  image,
  className,
  routes,
}: ProductProps) {
  const { product_id, attribute } = product;

  const { name, stock, stock_pin, description } = attribute;

  const price = attribute?.price?.amount ?? 0;
  const oldPrice = price / (1 - 0.12); // adds roughly 12% back

  return (
    <div className={cn(className)}>
      <Link
        href={routes.produk.detail(
          String(generateSlug(`${name}-${product_id}`))
        )}
      >
        <div className="relative">
          <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              alt={name}
              src={image}
              fill
              priority
              quality={90}
              sizes="(max-width: 768px) 100vw"
              className="h-full w-full object-cover"
            />
          </div>
          <Text
            as="span"
            className="absolute start-5 top-5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold dark:bg-gray-200 dark:text-gray-700"
          >
            {calculatePercentage(price, oldPrice)}% Discount
          </Text>
        </div>

        <div className="pt-3">
          <Title
            as="h6"
            className="mb-1 truncate font-semibold transition-colors hover:text-primary"
          >
            {name}
          </Title>

          <Text as="p" className="truncate">
            {description}
          </Text>
          <div className="mt-2 flex items-center font-semibold text-gray-900">
            {toCurrency(Number(price))}
            {stock && (
              <del className="ps-1.5 text-[13px] font-normal text-gray-500">
                {toCurrency(Number(oldPrice))}
              </del>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
