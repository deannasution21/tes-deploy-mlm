'use client';

import {
  ordersColumns,
  ordersColumnsNew,
} from '@/app/shared/ecommerce/order/order-list/columns';
import { orderData } from '@/data/order-data';
import Table from '@core/components/table';
import { CustomExpandedComponent } from '@core/components/table/custom/expanded-row';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import { OrdersDataType } from '@/app/shared/ecommerce/dashboard/recent-order';
import Filters from './filters';
import { Alert, TableVariantProps, Text } from 'rizzui';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { fetchWithAuth } from '@/utils/fetchWithAuth';

export interface TransactionResponse {
  code: number;
  success: boolean;
  message: string;
  data: TransactionData;
}

export interface TransactionData {
  count: number;
  transactions: Transaction[];
}

export interface Transaction {
  ref_id: string;
  attributes: TransactionAttributes;
}

export interface TransactionAttributes {
  created_at: string;
  paid_at: string | null;
  buyer: BuyerInfo;
  products: Product[];
  totals: Totals;
  status: StatusInfo;
}

export interface BuyerInfo {
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  shipping_method: string;
  shipping_province: string;
  shipping_city: string;
  shipping_address: string;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  stock_pin: number;
  sub_total: number;
  total_pin: number;
  plan: string;
}

export interface Totals {
  sub_total_amount: number;
  sub_total_currency: string;
  total_pin: number;
}

export interface StatusInfo {
  code: number;
  message: string;
}

export default function OrderTable({
  className,
  variant = 'modern',
  hideFilters = true,
  hidePagination = false,
}: {
  className?: string;
  hideFilters?: boolean;
  hidePagination?: boolean;
  variant?: TableVariantProps;
}) {
  const { data: session } = useSession();
  const [dataPesanan, setDataPesanan] = useState<Transaction[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    fetchWithAuth<TransactionResponse>(
      `/_transactions/history-transaction/${session?.user?.id}?type=payment`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setDataPesanan(data?.data?.transactions);
        setData(data?.data?.transactions);
      })
      .catch((error) => {
        console.error(error);
        setDataPesanan([]);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  const { table, setData } = useTanStackTable<Transaction>({
    tableData: dataPesanan,
    columnConfig: ordersColumnsNew(),
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      enableColumnResizing: false,
    },
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p>Sedang memuat data...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Alert variant="flat" color="success" className="mb-7">
        <Text className="font-semibold">Informasi</Text>
        <Text className="break-normal">
          Klik pada kode <strong>INVOICE</strong> untuk menampilkan detail
          Pesanan
        </Text>
      </Alert>
      {!hideFilters && <Filters table={table} />}
      <Table
        table={table}
        variant={variant}
        classNames={{
          container: 'border border-muted rounded-md border-t-0',
          rowClassName: 'last:border-0',
        }}
      />
      {!hidePagination && <TablePagination table={table} className="py-4" />}
    </div>
  );
}
