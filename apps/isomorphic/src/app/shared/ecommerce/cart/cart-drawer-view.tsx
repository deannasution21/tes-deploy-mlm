'use client';

import Link from 'next/link';
import isEmpty from 'lodash/isEmpty';
import OrderProducts from '@/app/shared/ecommerce/checkout/order-products';
import { toCurrency } from '@core/utils/to-currency';
import { Title, Text, Button, EmptyProductBoxIcon } from 'rizzui';
import cn from '@core/utils/class-names';
import { routes } from '@/config/routes';
import { ProductCartItem } from '@/types';
import DrawerHeader from '@/app/shared/drawer-header';
import defaultPlaceholder from '@public/assets/img/logo/logo-ipg3.jpeg';
import imgHNB from '@public/assets/img/product/HNB 19.jpg';
import imgSNP from '@public/assets/img/product/SNP 3.jpg';
import imgLILAC from '@public/assets/img/product/LILAC.jpg';
import imgFCMIST from '@public/assets/img/product/FCMIST.jpeg';
import imgEGAM from '@public/assets/img/product/EGAM.jpeg';

type CartDrawerViewProps = {
  items: ProductCartItem[];
  total: number;
  addItemToCart: (item: ProductCartItem, quantity: number) => void;
  removeItemFromCart: (id: string) => void;
  clearItemFromCart: (id: string) => void;
  setOpenDrawer: (id: boolean) => void;
};

export default function CartDrawerView({
  items,
  total,
  addItemToCart,
  removeItemFromCart,
  clearItemFromCart,
  setOpenDrawer,
}: CartDrawerViewProps) {
  const isCartEmpty = isEmpty(items);
  return (
    <div className="flex h-full w-full flex-col">
      <DrawerHeader
        heading="Keranjang Pembelian"
        onClose={() => setOpenDrawer(false)}
      />

      {isCartEmpty ? (
        <div className="grid h-full place-content-center">
          <EmptyProductBoxIcon className="mx-auto h-auto w-52 text-gray-400" />
          <Title as="h5" className="mt-6 text-center">
            Keranjang Anda masih kosong
          </Title>
          <Text className="mt-1 text-center">Beli Produk Sekarang!!</Text>
        </div>
      ) : (
        <OrderProducts
          items={items.map((item) => ({
            ...item,
            image:
              item.id === 'PRD0002'
                ? imgHNB
                : item.id === 'PRD0003'
                  ? imgLILAC
                  : item.id === 'PRD0001'
                    ? imgSNP
                    : item.id === 'PRD0004'
                      ? imgFCMIST
                      : item.id === 'PRD0005'
                        ? imgEGAM
                        : defaultPlaceholder,
          }))}
          showControls
          className="mb-5 gap-0 divide-y border-b border-gray-100"
          itemClassName="p-4 pb-5 md:px-6"
          addItemToCart={addItemToCart}
          removeItemFromCart={removeItemFromCart}
          clearItemFromCart={clearItemFromCart}
        />
      )}

      {isCartEmpty ? (
        <div className="px-4 py-5">
          <Button
            className="w-full"
            variant="flat"
            onClick={() => setOpenDrawer(false)}
          >
            Kembali ke Produk
          </Button>
        </div>
      ) : (
        <Link
          href={routes.produk.checkout}
          className={cn(
            'mx-4 mb-6 mt-auto flex items-center justify-between rounded-md bg-primary px-5 py-2 font-medium text-primary-foreground md:mx-6'
          )}
        >
          Checkout
          <span className="-mr-3 inline-flex rounded-md bg-primary-lighter p-2 px-4 text-primary-dark">
            {toCurrency(total)}
          </span>
        </Link>
      )}
    </div>
  );
}
