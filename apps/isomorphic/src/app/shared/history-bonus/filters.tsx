'use client';

import { PiMagnifyingGlassBold } from 'react-icons/pi';
import { Button, Flex, Input } from 'rizzui';

interface FiltersHistoryBonusProps {
  monthYear: string;
  setMonthYear: React.Dispatch<React.SetStateAction<string>>;
}

export default function FiltersHistoryBonus({
  monthYear,
  setMonthYear,
}: FiltersHistoryBonusProps) {
  return (
    <Flex align="center" justify="start" className="mb-4">
      {/* <Input
        type="search"
        placeholder="Cari data diagram disini..."
        value={username}
        onClear={() => setUsername('')}
        onChange={(e) => setUsername(e.target.value)}
        inputClassName="h-9"
        clearable
        prefix={<PiMagnifyingGlassBold className="size-4" />}
      /> */}
      <Input
        type="month"
        label="Periode Bulan dan Tahun"
        value={monthYear}
        onClear={() => setMonthYear('')}
        onChange={(e) => setMonthYear(e.target.value)}
        inputClassName="h-9"
      />
    </Flex>
  );
}
