'use client';

import { PiMagnifyingGlassBold } from 'react-icons/pi';
import { Button, Flex, Input } from 'rizzui';

interface FiltersDiagramJaringanProps {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

export default function FiltersDiagramJaringan({
  username,
  setUsername,
}: FiltersDiagramJaringanProps) {
  return (
    <Flex align="center" justify="start" className="mb-4">
      <Input
        type="search"
        placeholder="Cari data diagram disini..."
        value={username}
        onClear={() => setUsername('')}
        onChange={(e) => setUsername(e.target.value)}
        inputClassName="h-9"
        clearable
        prefix={<PiMagnifyingGlassBold className="size-4" />}
      />
    </Flex>
  );
}
