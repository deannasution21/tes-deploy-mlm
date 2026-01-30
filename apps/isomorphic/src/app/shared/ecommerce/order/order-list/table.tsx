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
  Select,
  TableVariantProps,
  Text,
  Title,
} from 'rizzui';
import { Form } from '@core/ui/form';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import WidgetCard from '@core/components/cards/widget-card';
import cn from '@core/utils/class-names';
import { PiTrophy, PiX } from 'react-icons/pi';
import { Controller, SubmitHandler } from 'react-hook-form';
import {
  UbahStatusPesananInput,
  ubahStatusPesananSchema,
} from '@/validators/ubah-status-pesanan-schema';
import { toast } from 'react-hot-toast';
import {
  InvoiceComponent,
  TransactionData as InvoiceTransactionData,
  TransactionDetailResponse,
} from '../order-view';
import { useReactToPrint } from 'react-to-print';
import { StatCard } from '@/app/shared/laporan/status';

export interface TransactionResponse {
  code: number;
  success: boolean;
  message: string;
  data: TransactionData;
}

export interface TransactionData {
  count: number;
  total_pin_generate?: number;
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
  const [dataTP, setDataTP] = useState<TransactionData | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isLoadingS, setLoadingS] = useState(false);
  const [type, setType] = useState<string>('all');

  const [invoice, setInvoice] = useState<InvoiceTransactionData | null>(null);

  const printRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: printRef, // ✅ new type-safe property
    documentTitle: `Invoice #`,
    onAfterPrint: () => {
      setIsPrinting(false); // printing finished
    },
  });

  const startPrint = (invoiceID?: string) => {
    setIsPrinting(true);

    if (invoiceID) {
      // Update document title dynamically
      document.title = `Invoice-${invoiceID}`;

      fetchInvoice(invoiceID);
    } else {
      toast.error(<Text as="b">ID Invoice tidak dicantumkan</Text>);
    }
  };

  const [modalState, setModalState] = useState({
    isOpen: false,
  });

  const statusPesanan = [
    {
      label: 'Pesanan Disetujui',
      value: 'approved',
    },
  ];

  const [valuesModal, setValuesModal] = useState({
    ref_id: '',
    username: '',
    status: '',
  });
  const [resetValues, setResetValues] = useState({
    ref_id: '',
    username: '',
    status: '',
  });

  const fetchInvoice = async (invoiceID: string) => {
    if (!session?.accessToken) return;

    setIsPrinting(true);

    fetchWithAuth<TransactionDetailResponse>(
      `/_transactions/${invoiceID}`,
      { method: 'GET' },
      session.accessToken
    )
      .then((data) => {
        setInvoice(data.data); // <--- ADD THIS LINE
        setTimeout(() => {
          handlePrint?.();
        }, 150);
      })
      .catch((error) => {
        console.error(error);
        setInvoice(null);
        setIsPrinting(false);
      });
  };

  useEffect(() => {
    if (!session?.accessToken) return;

    setLoading(true);

    const url =
      session?.user?.id === 'adminpin2026' || session?.user?.id === 'adminstock'
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
        setDataTP(data?.data ?? null);
      })
      .catch((error) => {
        console.error(error);
        setDataPesanan([]);
        setData([]);
        setDataTP(null);
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
    columnConfig: ordersColumnsNew(
      session?.user?.id as string,
      setModalState,
      setValuesModal,
      startPrint,
      isPrinting
    ),
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

  const onSubmit: SubmitHandler<UbahStatusPesananInput> = (data) => {
    if (!session?.accessToken) return;

    setLoadingS(true);

    fetchWithAuth<any>(
      `/_transactions/change-transaction-status`,
      { method: 'PUT', body: JSON.stringify(data) },
      session.accessToken
    )
      .then((data) => {
        toast.error(<Text as="b">Ubah Status Pesanan Berhasil</Text>);
        setModalState({ isOpen: false });
      })
      .catch((error) => {
        toast.error(<Text as="b">Ubah Status Pesanan Gagal</Text>);
        console.error(error);
      })
      .finally(() => setLoadingS(false));
  };

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
          {/* <StatCard
            key={'stat-card-0'}
            transaction={{
              title: 'Total Pin Dibeli',
              amount: (dataTP?.total_pin_generate ?? 0).toString(),
              increased: true,
              percentage: '0',
              icon: PiTrophy,
            }}
            className="w-full min-w-[300px] md:w-[300px] md:max-w-[300px]"
          /> */}

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

      {invoice && (
        <InvoiceComponent
          invoice={invoice}
          ref={printRef}
          handlePrint={startPrint}
          isPrinting={isPrinting}
        />
      )}

      {/* Modal */}
      {session?.user?.id === 'adminpin2026' ||
        (session?.user?.id === 'adminstock' && (
          <Modal
            isOpen={modalState.isOpen}
            size="sm"
            onClose={() =>
              setModalState((prevState) => ({ ...prevState, isOpen: false }))
            }
          >
            <div className="m-auto px-7 pb-8 pt-6">
              <div className="mb-7 flex items-center justify-between">
                <Title as="h3">Ubah Status Pesanan</Title>
                <ActionIcon
                  size="sm"
                  variant="text"
                  onClick={() =>
                    setModalState((prevState) => ({
                      ...prevState,
                      isOpen: false,
                    }))
                  }
                >
                  <PiX className="h-auto w-6" strokeWidth={1.8} />
                </ActionIcon>
              </div>
              <Form<UbahStatusPesananInput>
                validationSchema={ubahStatusPesananSchema}
                onSubmit={onSubmit}
                resetValues={{
                  ref_id: valuesModal.ref_id,
                  status: valuesModal.status, // convert number to string
                }}
                useFormProps={{
                  defaultValues: {
                    ref_id: valuesModal.ref_id,
                    status: valuesModal.status,
                  },
                }}
                className="flex flex-col gap-x-5 gap-y-6 [&_label>span]:font-medium"
              >
                {({
                  register,
                  control,
                  watch,
                  setValue,
                  reset,
                  formState: { errors },
                }) => {
                  return (
                    <>
                      <Input
                        label="Username Pembeli"
                        value={valuesModal.username} // 👈 directly use value from state
                        inputClassName="[&_input]:uppercase"
                        disabled
                      />
                      <Input
                        label="Invoice ID"
                        {...register('ref_id')}
                        disabled
                      />

                      <Controller
                        name="status"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Select
                            label="Status Pesanan"
                            placeholder="Pilih Status Pesanan"
                            options={statusPesanan}
                            onChange={onChange}
                            value={value}
                            getOptionValue={(o) => o.value}
                            displayValue={(v) =>
                              statusPesanan.find((s) => s.value === v)?.label ??
                              ''
                            }
                            error={errors.status?.message}
                          />
                        )}
                      />

                      <div className="mt-2 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          disabled={isLoadingS}
                          onClick={() => {
                            reset(resetValues); // clear form
                            setModalState({ isOpen: false });
                          }}
                        >
                          Batal
                        </Button>
                        <Button
                          type="submit"
                          isLoading={isLoadingS}
                          disabled={isLoadingS}
                        >
                          Ubah Status
                        </Button>
                      </div>
                    </>
                  );
                }}
              </Form>
            </div>
          </Modal>
        ))}
    </>
  );
}
