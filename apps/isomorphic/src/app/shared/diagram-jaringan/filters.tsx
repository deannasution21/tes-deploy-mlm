'use client';

import { PiMagnifyingGlassBold } from 'react-icons/pi';
import { Button, Flex, Input } from 'rizzui';

interface FiltersDiagramJaringanProps {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  handleSearch?: (query?: string) => void;
  upline: string;
}

export default function FiltersDiagramJaringan({
  username,
  setUsername,
  handleSearch,
  upline,
}: FiltersDiagramJaringanProps) {
  return (
    <Flex align="center" justify="start" className="mb-4 gap-2">
      <Input
        type="search"
        placeholder="Cari data diagram disini..."
        value={username}
        onClear={() => {
          setUsername('');
          // handleSearch?.(''); // 🔥 run search automatically
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
      {/* <Button
        size="sm"
        onClick={() => handleSearch?.(upline)}
        className="h-9"
        disabled={username === ''}
      >
        Kembali
      </Button> */}
    </Flex>
  );
}
