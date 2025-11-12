'use client';

import { ordersColumnsNew } from '@/app/shared/ecommerce/order/order-list/columns';
import Table from '@core/components/table';
import { useTanStackTable } from '@core/components/table/custom/use-TanStack-Table';
import TablePagination from '@core/components/table/pagination';
import Filters from './filters';
import {
  ActionIcon,
  Alert,
  Button,
  Input,
  Modal,
  TableVariantProps,
  Text,
  Title,
} from 'rizzui';
import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import WidgetCard from '@core/components/cards/widget-card';
import cn from '@core/utils/class-names';
import { PiX } from 'react-icons/pi';

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
  username: string;
  attributes: TransactionAttributes;
}

export interface TransactionAttributes {
  ref_id: string;
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
  hideFilters = false,
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
  const [type, setType] = useState<string>('all');

  const [modalState, setModalState] = useState({
    isOpen: false,
  });

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    const url =
      session?.user?.id === 'adminpin2026'
        ? `/_transactions/history-transaction?type=payment`
        : `/_transactions/history-transaction/${session?.user?.id}?type=payment`;

    fetchWithAuth<TransactionResponse>(
      url,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setDataPesanan(data?.data?.transactions ?? []);
        setData(data?.data?.transactions ?? []);
      })
      .catch((error) => {
        console.error(error);
        setDataPesanan([]);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [session?.accessToken]);

  // 🧠 Filter orders by `type`
  const filteredPesanan = useMemo(() => {
    if (type === 'all') return dataPesanan;
    return dataPesanan.filter(
      (item) => String(item.attributes?.status?.code) === type
    );
  }, [dataPesanan, type]);

  // 🧩 Table initialization
  const { table, setData } = useTanStackTable<Transaction>({
    tableData: filteredPesanan,
    columnConfig: ordersColumnsNew(session?.user?.id as string, setModalState),
    options: {
      initialState: {
        pagination: {
          pageIndex: 0,
          pageSize: 10,
        },
      },
      meta: {},
      enableColumnResizing: false,
    },
  });

  // ✅ Sync table when filter changes
  useEffect(() => {
    setData(filteredPesanan);
  }, [filteredPesanan, setData]);

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <p>Sedang memuat data...</p>
      </div>
    );
  }

  return (
    <>
      <div className="@container">
        <div className="grid grid-cols-1 gap-6 3xl:gap-8">
          <WidgetCard
            className={cn('p-0 lg:p-0', className)}
            title="History Pembelian"
            titleClassName="w-[19ch]"
            actionClassName="w-full ps-0 items-center weee"
            headerClassName="mb-6 items-start flex-col @[57rem]:flex-row @[57rem]:items-center px-5 pt-5 lg:pt-7 lg:px-7"
            action={<Filters table={table} type={type} setType={setType} />}
          >
            <div className="px-5 lg:px-7">
              <Alert variant="flat" color="success" className="mb-7">
                <Text className="font-semibold">Informasi</Text>
                <Text className="break-normal">
                  Klik pada kode <strong>INVOICE</strong> untuk menampilkan
                  detail Pesanan
                </Text>
              </Alert>
            </div>
            <Table table={table} variant="modern" />
            <TablePagination table={table} className="p-4" />
          </WidgetCard>
        </div>
      </div>
      <Modal
        isOpen={modalState.isOpen}
        size="sm"
        onClose={() =>
          setModalState((prevState) => ({ ...prevState, isOpen: false }))
        }
      >
        <div className="m-auto px-7 pb-8 pt-6">
          <div className="mb-7 flex items-center justify-between">
            <Title as="h3">Ubah Status</Title>
            <ActionIcon
              size="sm"
              variant="text"
              onClick={() =>
                setModalState((prevState) => ({ ...prevState, isOpen: false }))
              }
            >
              <PiX className="h-auto w-6" strokeWidth={1.8} />
            </ActionIcon>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-6 [&_label>span]:font-medium">
            <Input label="First Name *" inputClassName="border-2" size="lg" />
            <Button
              type="submit"
              size="lg"
              className="col-span-2 mt-2"
              onClick={() =>
                setModalState((prevState) => ({ ...prevState, isOpen: false }))
              }
            >
              Create an Account
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
