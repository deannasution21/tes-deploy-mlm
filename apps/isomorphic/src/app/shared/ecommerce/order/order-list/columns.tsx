'use client';

import { OrdersDataType } from '@/app/shared/ecommerce/dashboard/recent-order';
import { routes } from '@/config/routes';
import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import TableRowActionGroup from '@core/components/table-utils/table-row-action-group';
import TableAvatar from '@core/ui/avatar-card';
import DateCell from '@core/ui/date-cell';
import { createColumnHelper } from '@tanstack/react-table';
import { PiCaretDownBold, PiCaretUpBold } from 'react-icons/pi';
import { ActionIcon, Text } from 'rizzui';
import { Transaction } from './table';
import Link from 'next/link';

const columnHelper = createColumnHelper<OrdersDataType>();
const columnHelperNew = createColumnHelper<Transaction>();

export const ordersColumns = (expanded: boolean = true) => {
  const columns = [
    columnHelper.display({
      id: 'id',
      size: 120,
      header: 'ID',
      cell: ({ row }) => <>#{row.original.id}</>,
    }),
    columnHelper.accessor('name', {
      id: 'customer',
      size: 300,
      header: 'Nama',
      enableSorting: false,
      cell: ({ row }) => (
        <TableAvatar
          src={row.original.avatar}
          name={row.original.name}
          description={row.original.email.toLowerCase()}
        />
      ),
    }),
    columnHelper.display({
      id: 'items',
      size: 150,
      header: 'Produk',
      cell: ({ row }) => (
        <Text className="font-medium text-gray-700">{row.original.items}</Text>
      ),
    }),
    columnHelper.accessor('price', {
      id: 'price',
      size: 150,
      header: 'Total',
      cell: ({ row }) => (
        <Text className="font-medium text-gray-700">${row.original.price}</Text>
      ),
    }),
    columnHelper.accessor('createdAt', {
      id: 'createdAt',
      size: 200,
      header: 'Tanggal',
      cell: ({ row }) => <DateCell date={new Date(row.original.createdAt)} />,
    }),
    columnHelper.accessor('status', {
      id: 'status',
      size: 140,
      header: 'Status',
      enableSorting: false,
      cell: ({ row }) => getStatusBadge(row.original.status),
    }),
    columnHelper.display({
      id: 'action',
      size: 130,
      cell: ({
        row,
        table: {
          options: { meta },
        },
      }) => (
        <TableRowActionGroup
          isEdit={false}
          // editUrl={routes.eCommerce.editOrder(row.original.id)}
          viewUrl={routes.eCommerce.orderDetails(row.original.id)}
          isDelete={false}
          // deletePopoverTitle={`Delete the order`}
          // deletePopoverDescription={`Are you sure you want to delete this #${row.original.id} order?`}
          // onDelete={() => meta?.handleDeleteRow?.(row.original)}
        />
      ),
    }),
  ];

  return expanded ? [expandedOrdersColumns, ...columns] : columns;
};

export const ordersColumnsNew = (expanded: boolean = true) => {
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
    columnHelperNew.accessor('ref_id', {
      id: 'ref_id',
      size: 150,
      header: 'Invoice',
      cell: ({ row }) => (
        <Link
          href={routes.produk.pesanan.detail(row.original.ref_id)}
          className="font-medium text-primary"
        >
          <u>{row.original.ref_id}</u>
        </Link>
      ),
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
          <Text className="text-gray-700">
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

const expandedOrdersColumns = columnHelper.display({
  id: 'expandedHandler',
  size: 60,
  cell: ({ row }) => (
    <>
      {row.getCanExpand() && (
        <ActionIcon
          size="sm"
          rounded="full"
          aria-label="Expand row"
          className="ms-2"
          variant={row.getIsExpanded() ? 'solid' : 'outline'}
          onClick={row.getToggleExpandedHandler()}
        >
          {row.getIsExpanded() ? (
            <PiCaretUpBold className="size-3.5" />
          ) : (
            <PiCaretDownBold className="size-3.5" />
          )}
        </ActionIcon>
      )}
    </>
  ),
});

const expandedOrdersColumnsNew = columnHelperNew.display({
  id: 'expandedHandler',
  size: 60,
  cell: ({ row }) => (
    <>
      {row.getCanExpand() && (
        <ActionIcon
          size="sm"
          rounded="full"
          aria-label="Expand row"
          className="ms-2"
          variant={row.getIsExpanded() ? 'solid' : 'outline'}
          onClick={row.getToggleExpandedHandler()}
        >
          {row.getIsExpanded() ? (
            <PiCaretUpBold className="size-3.5" />
          ) : (
            <PiCaretDownBold className="size-3.5" />
          )}
        </ActionIcon>
      )}
    </>
  ),
});
