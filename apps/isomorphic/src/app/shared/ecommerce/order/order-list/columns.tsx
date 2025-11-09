'use client';

import { routes } from '@/config/routes';
import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import DateCell from '@core/ui/date-cell';
import { createColumnHelper } from '@tanstack/react-table';
import { ActionIcon, Text } from 'rizzui';
import { Transaction } from './table';
import Link from 'next/link';

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
      id: 'customer',
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
          <Text className="text-xs text-gray-500">
            {row.original.attributes.buyer.customer_phone}
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
