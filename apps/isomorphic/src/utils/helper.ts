import { BankData } from '@/types';

export function getBankNameByCode(
  dataBank: BankData[],
  bankCode: string
): string | null {
  const found = dataBank.find((item) => item.bank_code === bankCode);
  return found ? found.name : null;
}

export function removeUnderscore(str?: string) {
  const what =
    str?.replace(/_/g, ' ')?.replace(/\b\w/g, (c) => c.toUpperCase()) ?? '-';
  return what;
}

export function formatToYearMonth(dateStr: any) {
  const date = new Date(dateStr);

  // Prevent invalid date error
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string');
  }

  const formatted = date.toISOString().slice(0, 7);
  return formatted;
}

export function formatToYMD(dateStr: any) {
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string');
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// 150000 -> "150.000"
export function formatRupiah(value: number | string) {
  return Number(value).toLocaleString('id-ID', { maximumFractionDigits: 0 });
}

// "150.000" / "Rp 150.000,00" -> 150000 (desimal setelah koma dibuang)
export function parseRupiah(str: string) {
  const digits = str.split(',')[0].replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}

export function underscoreToCaptalize(str: string) {
  return str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
