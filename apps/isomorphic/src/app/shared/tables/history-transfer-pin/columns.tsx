'use client';

import { getStatusBadge } from '@core/components/table-utils/get-status-badge';
import DateCell from '@core/ui/date-cell';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox, Text } from 'rizzui';
import { HistoryTransferPinItem } from '@/types';

const statusColorClassName = {
  Complete: 'text-green-dark before:bg-green-dark',
  Pending: 'before:bg-orange text-orange-dark',
  Canceled: 'text-red-dark before:bg-red-dark',
};

const columnHelper = createColumnHelper<HistoryTransferPinItem>();

export const transactionHistoryColumns = [
  columnHelper.accessor('date', {
    id: 'date',
    header: 'Tanggal',
    size: 180,
    cell: (info) => <DateCell date={info.getValue()} />,
  }),
  columnHelper.accessor('from', {
    id: 'from',
    header: 'Pengirim',
    size: 150,
    cell: (info) => (
      <Text className="whitespace-nowrap">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('to', {
    id: 'to',
    header: 'Penerima',
    size: 150,
    cell: (info) => (
      <Text className="whitespace-nowrap">{info.getValue()}</Text>
    ),
  }),
  columnHelper.accessor('message', {
    id: 'message',
    header: 'Detail',
    size: 250,
    cell: (info) => {
      const row = info.row.original;
      const dataList = row.data || [];

      return (
        <details className="group rounded border">
          {/* ACCORDION HEADER */}
          <summary className="flex cursor-pointer list-none items-center justify-between p-3 font-semibold">
            {info.getValue()}

            {/* arrow */}
            <span className="transition-transform group-open:rotate-180">
              ▼
            </span>
          </summary>

          {/* ACCORDION CONTENT */}
          <div className="space-y-3 p-3">
            <ol className="ml-4 list-decimal space-y-3">
              {dataList.map((item: any, index: number) => (
                <li key={index} className="rounded border p-2">
                  {/* PIN CODE */}
                  <div>
                    <strong>PIN Code:</strong>
                    <p className="break-all text-sm">{item.pin_code}</p>
                  </div>

                  {/* ATTRIBUTES */}
                  <div className="mt-2 space-y-1 text-sm">
                    <div>
                      <b>Created:</b> {item.attributes.created_at}
                    </div>
                    <div>
                      <b>From:</b> {item.attributes.from}
                    </div>
                    <div>
                      <b>To:</b> {item.attributes.to}
                    </div>
                    <div>
                      <b>Total PIN:</b> {item.attributes.total_pin}
                    </div>
                    <div>
                      <b>Note:</b> {item.attributes.note}
                    </div>
                    <div>
                      <b>Type:</b> {item.attributes.type_pin}
                    </div>
                    <div>
                      <b>Status:</b>
                      <span className="ml-1 font-semibold text-green-600">
                        {item.attributes.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </details>
      );
    },
  }),
];
