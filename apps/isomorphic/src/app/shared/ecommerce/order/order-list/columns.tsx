'use client';

import { routes } from '@/config/routes';
import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import DateCell from '@core/ui/date-cell';
import { createColumnHelper } from '@tanstack/react-table';
import { ActionIcon, Button, Text } from 'rizzui';
import { Transaction } from './table';
import Link from 'next/link';
import { PiPrinter, PiTruck } from 'react-icons/pi';

const columnHelperNew = createColumnHelper<Transaction>();

export const ordersColumnsNew = (username: string) => {
  const columns = [
    // columnHelperNew.display({
    //   id: 'id',
    //   size: 120,
    //   header: 'ID',
    //   cell: ({ row }) => <>#{row.original.ref_id}</>,
    // }),
    columnHelperNew.accessor('attributes.created_at', {
      id: 'createdAt',
      size: 150,
      header: 'Tanggal',
      cell: ({ row }) => (
        <DateCell date={new Date(row.original.attributes.created_at)} />
      ),
    }),
    columnHelperNew.accessor('attributes.ref_id', {
      id: 'attributes.ref_id',
      size: 150,
      header: 'Invoice',
      cell: ({ row }) => {
        const url =
          username === 'adminpin2025'
            ? routes.produk.pesananStockist.detail(
                row.original.attributes.ref_id
              )
            : routes.produk.pesanan.detail(row.original.attributes.ref_id);
        return (
          <Link href={url} className="font-medium text-primary">
            <u>{row.original.attributes.ref_id}</u>
          </Link>
        );
      },
    }),
    columnHelperNew.accessor('attributes.buyer.customer_name', {
      id: 'customer_name',
      size: 150,
      header: 'Nama',
      enableSorting: false,
      cell: ({ row }) => (
        <>
          <Text className="text-gray-700">
            {row.original.attributes.buyer.customer_name}
          </Text>
          <Text className="text-xs text-gray-500">
            @{row.original.attributes.buyer.customer_id}
          </Text>
        </>
      ),
    }),
    columnHelperNew.accessor('attributes.buyer.customer_phone', {
      id: 'customer_phone',
      size: 150,
      header: 'No. HP',
      enableSorting: false,
      cell: (info) => (
        <>
          <Text className="text-gray-700">{info.getValue()}</Text>
        </>
      ),
    }),
    columnHelperNew.accessor('attributes.buyer.shipping_address', {
      id: 'shipping_address',
      size: 150,
      header: 'Alamat',
      enableSorting: false,
      cell: ({ row }) => (
        <>
          <Text className="text-gray-700">
            {row.original.attributes.buyer.shipping_address},{' '}
            {row.original.attributes.buyer.shipping_city},{' '}
            {row.original.attributes.buyer.shipping_province}
          </Text>
        </>
      ),
    }),
    columnHelperNew.display({
      id: 'items',
      size: 150,
      header: 'Produk',
      cell: ({ row }) => {
        const products = row.original.attributes.products;

        return (
          <ul className="list-disc ps-5">
            {products?.map((v, i) => (
              <li key={i}>
                <Text className="text-gray-700">
                  {v.name} | Qty: {v.quantity}
                </Text>
              </li>
            ))}
          </ul>
        );
      },
    }),
    columnHelperNew.accessor('attributes.totals.sub_total_currency', {
      id: 'price',
      size: 150,
      header: 'Total',
      cell: ({ row }) => (
        <Text className="text-gray-700">
          {row.original.attributes.totals.sub_total_currency}
        </Text>
      ),
    }),
    columnHelperNew.accessor('attributes.totals.sub_total_currency', {
      id: 'pin',
      size: 150,
      header: 'PIN Generate',
      cell: ({ row }) => (
        <Text className="text-gray-700">
          {row.original.attributes.totals.total_pin}
        </Text>
      ),
    }),
    columnHelperNew.accessor('attributes.status.message', {
      id: 'status',
      size: 150,
      header: 'Status',
      enableSorting: false,
      cell: ({ row }) =>
        getStatusBadge(row.original.attributes.status.code.toString()),
    }),
    columnHelperNew.accessor('attributes.status.code', {
      id: 'aksi',
      size: 150,
      header: 'Aksi',
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-2">
            <Button size="sm">
              <PiPrinter className="mr-2 h-4 w-4" />
              <span>Cetak Invoice</span>
            </Button>
            {(username === 'adminstock' || username === 'admin_stock') && (
              <Button size="sm" variant="flat">
                <PiTruck className="mr-2 h-4 w-4" />
                <span>Ubah Status</span>
              </Button>
            )}
          </div>
        );
      },
    }),
    // columnHelperNew.display({
    //   id: 'action',
    //   size: 130,
    //   cell: ({
    //     row,
    //     table: {
    //       options: { meta },
    //     },
    //   }) => (
    //     <TableRowActionGroup
    //       isEdit={false}
    //       // editUrl={routes.eCommerce.editOrder(row.original.id)}
    //       viewUrl={routes.produk.pesanan.detail(row.original.ref_id)}
    //       isDelete={false}
    //       // deletePopoverTitle={`Delete the order`}
    //       // deletePopoverDescription={`Are you sure you want to delete this #${row.original.id} order?`}
    //       // onDelete={() => meta?.handleDeleteRow?.(row.original)}
    //     />
    //   ),
    // }),
  ];

  return columns;
};
