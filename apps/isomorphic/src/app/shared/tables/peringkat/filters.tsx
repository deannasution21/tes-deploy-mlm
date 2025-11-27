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
    value: 'infinity_emperor',
    label: 'Infinity Emperor',
  },
  {
    value: 'global_ambassador',
    label: 'Global Ambassador',
  },
  {
    value: 'grand_director',
    label: 'Grand Director',
  },
  {
    value: 'prestige_leader',
    label: 'Prestige Leader',
  },
  {
    value: 'royal_achiever',
    label: 'Royal Achiever',
  },
  {
    value: 'elite_builder',
    label: 'Elite Builder',
  },
  {
    value: 'starter_member',
    label: 'Starter Member',
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
      <Flex align="center" className="order-2 @3xl:order-1 @3xl:max-w-[250px]">
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
        placeholder="Cari data peringkat..."
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
    case 'infinity_emperor':
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-yellow-400" />
          <Text className="ms-2 font-semibold uppercase text-yellow-600">
            {option.label}
          </Text>
        </div>
      );

    case 'global_ambassador':
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-blue-400" />
          <Text className="ms-2 font-semibold uppercase text-blue-600">
            {option.label}
          </Text>
        </div>
      );

    case 'grand_director':
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-green-400" />
          <Text className="ms-2 font-semibold uppercase text-green-600">
            {option.label}
          </Text>
        </div>
      );

    case 'prestige_leader':
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-red-400" />
          <Text className="ms-2 font-semibold uppercase text-red-600">
            {option.label}
          </Text>
        </div>
      );

    case 'royal_achiever':
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-purple-400" />
          <Text className="ms-2 font-semibold uppercase text-purple-600">
            {option.label}
          </Text>
        </div>
      );

    case 'elite_builder':
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-pink-400" />
          <Text className="ms-2 font-semibold uppercase text-pink-600">
            {option.label}
          </Text>
        </div>
      );

    default:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-indigo-400" />
          <Text className="ms-2 font-semibold uppercase text-indigo-600">
            {option.label}
          </Text>
        </div>
      );
  }
}
