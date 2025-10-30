import { BankData } from '@/types';

export function getBankNameByCode(
  dataBank: BankData[],
  bankCode: string
): string | null {
  const found = dataBank.find((item) => item.bank_code === bankCode);
  return found ? found.name : null;
}
