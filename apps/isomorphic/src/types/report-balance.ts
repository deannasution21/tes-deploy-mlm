interface Money {
  amount: number;
  formatted: string;
  currency: string;
}

interface BankAccount {
  bank_name: string;
  account_number: string;
  bank_code: string;
  account_name: string;
}

interface WithdrawalInfo {
  multiple: Money;
  max_times: number;
  max_amount: Money;
  message: string;
}

export interface BalanceReport {
  code: number;
  success: boolean;
  message: string;
  data: BalanceResponseData;
}

export interface BalanceResponseData {
  bank_account: BankAccount;
  raw_balance: Money;
  deposit_balance: Money & {
    message: string;
  };
  available_balance: Money;
  withdrawal_info: WithdrawalInfo;
}
