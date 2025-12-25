'use client';

import { Badge, Button, Flex, Input, Select, Text } from 'rizzui';
import { type Table as ReactTableType } from '@tanstack/react-table';
import StatusField from '@core/components/controlled-table/status-field';
import { PiMagnifyingGlassBold, PiTrashDuotone } from 'react-icons/pi';
import { transactionTypes } from '@/data/transaction-history';

const transactionTypesOptions = Object.entries(transactionTypes).map(
  ([value, label]) => ({ label, value })
);

const statusOptions = [
  {
    value: 'member',
    label: 'MEMBER',
  },
  {
    value: 'stockist',
    label: 'STOCKIST',
  },
];

const tipeSearch = [
  {
    label: 'Username',
    value: 'username',
  },
  {
    label: 'Nama',
    value: 'name',
  },
  {
    label: 'Provinsi',
    value: 'province',
  },
  {
    label: 'Kota',
    value: 'city',
  },
  {
    label: 'Sponsor ID',
    value: 'sponsor_id',
  },
];

interface TableToolbarProps<T extends Record<string, any>> {
  table: ReactTableType<T>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  searchBy: string;
  setSearchBy: React.Dispatch<React.SetStateAction<string>>;
  handleSearch?: (query?: string) => void;
}

export default function Filters<TData extends Record<string, any>>({
  table,
  type,
  setType,
  username,
  setUsername,
  searchBy,
  setSearchBy,
  handleSearch,
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
        /> */}
      </Flex>

      {/* {isFiltered ? (
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
        placeholder="Cari data member/stockist..."
        onClear={() => table.setGlobalFilter('')}
        value={table.getState().globalFilter ?? ''}
        prefix={<PiMagnifyingGlassBold className="size-4" />}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        className="w-full @3xl:order-3 @3xl:ms-auto @3xl:max-w-72"
      /> */}

      <Flex align="center" justify="start" className="gap-2">
        <Select
          label=""
          // size="sm"
          className="w-32"
          selectClassName="h-9"
          dropdownClassName="!z-10 h-fit"
          inPortal={false}
          placeholder="Pilih Tipe"
          options={tipeSearch}
          onChange={(value) => setSearchBy(value as string)}
          value={searchBy}
          getOptionValue={(option) => option.value}
          displayValue={(selected) =>
            tipeSearch?.find((con) => con.value === selected)?.label ?? ''
          }
        />

        <Input
          type="search"
          placeholder={`Cari data ${type} disini...`}
          value={username}
          onClear={() => {
            setUsername('');
            handleSearch?.(''); // 🔥 run search automatically
          }}
          onChange={(e) => setUsername(e.target.value?.toLowerCase())}
          inputClassName="h-9 [&>input]:lowercase"
          clearable
          prefix={<PiMagnifyingGlassBold className="size-4" />}
        />

        <Button
          size="sm"
          onClick={() => handleSearch?.(username)}
          className="h-9"
        >
          Cari
        </Button>
      </Flex>
    </Flex>
  );
}

function renderOptionDisplayValue(option: {
  label: string;
  value: string | number;
}) {
  const valueStr = String(option.value).toLowerCase();

  switch (valueStr) {
    case 'member':
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-yellow-400" />
          <Text className="ms-2 font-semibold uppercase text-yellow-600">
            {option.label}
          </Text>
        </div>
      );

    case 'stockist':
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-blue-400" />
          <Text className="ms-2 font-semibold uppercase text-blue-600">
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
