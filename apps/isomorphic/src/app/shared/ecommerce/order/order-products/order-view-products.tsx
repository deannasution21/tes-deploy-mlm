'use client';

import Image from 'next/image';
import Table, { HeaderCell } from '@core/components/legacy-table';
import { useCart } from '@/store/quick-cart/cart.context';
import { Title, Text } from 'rizzui';
import { toCurrency } from '@core/utils/to-currency';
import { CartItem } from '@/types';
import { TransactionProduct } from '../order-view';
import defaultPlaceholder from '@public/assets/img/logo/logo-ipg3.jpeg';
import imgHNB from '@public/assets/img/product/HNB 19.jpg';
import imgSNP from '@public/assets/img/product/SNP 3.jpg';
import imgLILAC from '@public/assets/img/product/LILAC.jpeg';

const columns = [
  {
    title: <HeaderCell title="Produk" />,
    dataIndex: 'id',
    key: 'id',
    width: 150,
    render: (_: any, row: CartItem) => (
      <div className="flex items-center">
        <div className="relative aspect-square w-12 overflow-hidden rounded-lg">
          <Image
            alt={row.name}
            src={
              String(row.id) === 'prd0002'
                ? imgHNB
                : String(row.id) === 'prd0003'
                  ? imgLILAC
                  : String(row.id) === 'prd0001'
                    ? imgSNP
                    : defaultPlaceholder
            }
            fill
            sizes="(max-width: 768px) 100vw"
            className="object-cover"
          />
        </div>
        <div className="ms-4">
          <Title as="h6" className="!text-sm font-medium">
            {row.name}
          </Title>
        </div>
      </div>
    ),
  },
  {
    title: <HeaderCell title="PIN" align="right" />,
    dataIndex: 'total_pin',
    key: 'total_pin',
    width: 100,
    render: (total_pin: number) => (
      <Text className="text-end text-sm">{total_pin}</Text>
    ),
  },
  {
    title: <HeaderCell title="Harga" align="right" />,
    dataIndex: 'price',
    key: 'price',
    width: 100,
    render: (price: number, row: any) => {
      const discount = row.discount_per_unit;
      // if (discount > 0) {
      //   return (
      //     <>
      //       <Text className="text-danger text-end text-xs">
      //         {toCurrency(price)}
      //       </Text>
      //       <Text className="text-end text-sm">
      //         {toCurrency(price - discount)}
      //       </Text>
      //     </>
      //   );
      // }
      return (
        <>
          <Text className="text-end text-sm">{toCurrency(price)}</Text>
        </>
      );
    },
  },
  {
    title: <HeaderCell title="Jumlah" align="center" />,
    dataIndex: 'quantity',
    key: 'quantity',
    width: 100,
    render: (quantity: number) => (
      <Text className="text-center text-sm font-semibold">{quantity}</Text>
    ),
  },

  {
    title: <HeaderCell title="Total Harga" align="right" />,
    dataIndex: 'sub_total',
    key: 'sub_total',
    width: 100,
    render: (sub_total: number, row: CartItem) => (
      <Text className="text-end text-sm">{toCurrency(sub_total)}</Text>
    ),
  },
];

export default function OrderViewProducts({ data }: { data: any }) {
  const { items } = useCart();
  const datanya = data ?? items;
  return (
    <Table
      data={datanya}
      // @ts-ignore
      columns={columns}
      className="text-sm"
      variant="minimal"
      rowKey={(record) => record.id}
      scroll={{ x: 550 }}
    />
  );
}
