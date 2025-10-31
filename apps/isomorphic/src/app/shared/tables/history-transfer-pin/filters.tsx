'use client';

import { Badge, Button, Flex, Input, Text } from 'rizzui';
import { type Table as ReactTableType } from '@tanstack/react-table';
import StatusField from '@core/components/controlled-table/status-field';
import { PiMagnifyingGlassBold, PiTrashDuotone } from 'react-icons/pi';
import { transactionTypes } from '@/data/transaction-history';

const transactionTypesOptions = Object.entries(transactionTypes).map(
  ([value, label]) => ({ label, value })
);

const statusOptions = [
  {
    value: 'received',
    label: 'Diterima',
  },
  {
    value: 'send',
    label: 'Dikirim',
  },
];

interface TableToolbarProps<T extends Record<string, any>> {
  table: ReactTableType<T>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
}

export default function Filters<TData extends Record<string, any>>({
  table,
  type,
  setType,
}: TableToolbarProps<TData>) {
  const isFiltered =
    table.getState().globalFilter || table.getState().columnFilters.length > 0;

  return (
    <Flex
      align="center"
      direction="col"
      className="mt-6 @3xl:flex-row @[62rem]:mt-0"
    >
      <Flex align="center" className="order-2 @3xl:order-1 @3xl:max-w-[180px]">
        {/* <StatusField
          className="w-full"
          placeholder="Select type"
          options={transactionTypesOptions}
          dropdownClassName="!z-10 h-auto"
          getOptionValue={(option) => option.label}
          value={table.getColumn('type')?.getFilterValue() ?? ''}
          onChange={(e) => table.getColumn('type')?.setFilterValue(e)}
        /> */}
        <StatusField
          className="w-full"
          options={statusOptions}
          dropdownClassName="!z-10 h-auto"
          getOptionValue={(option) => option.value}
          value={type}
          onChange={(value: string) => setType(value)}
          getOptionDisplayValue={(option) => renderOptionDisplayValue(option)}
          displayValue={(selected: string) =>
            renderOptionDisplayValue(
              statusOptions.find((opt) => opt.value === selected) ??
                statusOptions[0]
            )
          }
        />
      </Flex>

      {isFiltered ? (
        <Button
          variant="flat"
          onClick={() => {
            table.resetGlobalFilter();
            table.resetColumnFilters();
          }}
          className="order-3 h-9 w-full bg-gray-200/70 @3xl:order-2 @3xl:w-24"
        >
          <PiTrashDuotone className="me-1.5 size-4" /> Clear
        </Button>
      ) : null}

      <Input
        type="search"
        clearable={true}
        inputClassName="h-[36px]"
        placeholder="Cari data transfer pin..."
        onClear={() => table.setGlobalFilter('')}
        value={table.getState().globalFilter ?? ''}
        prefix={<PiMagnifyingGlassBold className="size-4" />}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        className="w-full @3xl:order-3 @3xl:ms-auto @3xl:max-w-72"
      />
    </Flex>
  );
}

function renderOptionDisplayValue(option: {
  label: string;
  value: string | number;
}) {
  const valueStr = String(option.value).toLowerCase();

  switch (valueStr) {
    case 'received':
      return (
        <div className="flex items-center">
          <Badge color="warning" renderAsDot />
          <Text className="ms-2 font-semibold uppercase text-orange-dark">
            {option.label}
          </Text>
        </div>
      );

    case 'send':
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-semibold uppercase text-green-dark">
            {option.label}
          </Text>
        </div>
      );

    case 'canceled':
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-semibold uppercase text-red-600">
            {option.label}
          </Text>
        </div>
      );

    default:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-gray-400" />
          <Text className="ms-2 font-semibold uppercase text-gray-600">
            {option.label}
          </Text>
        </div>
      );
  }
}
