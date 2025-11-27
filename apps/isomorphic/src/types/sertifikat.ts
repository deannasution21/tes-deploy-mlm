export interface ReportResponse {
  code: number;
  success: boolean;
  message: string;
  data: ReportData;
}

export interface ReportData {
  username: string;
  name: string;
  bank_account: BankAccount;
  list: ReportList;
  sum_total_all: CurrencyAmountWithLabel;
}

export interface BankAccount {
  bank_name: string;
  account_number: string;
  account_name: string;
}

export interface ReportList {
  count: number;
  items: ReportItem[];
}

export interface ReportItem {
  username: string;
  transactions: ReportTransactions;
  key: number;
}

export interface ReportTransactions {
  pairing: PlanAmountMap;
  sponsor: PlanAmountMap;
  salary_withdrawal: PlanAmountMap;
  total: TotalPlanAmountMap;
}

export interface PlanAmountMap {
  plan_a: CurrencyAmount;
}

export interface TotalPlanAmountMap {
  plan_a: CurrencyAmount;
  all: CurrencyAmount;
}

export interface CurrencyAmount {
  amount: number;
  currency: string;
}

export interface CurrencyAmountWithLabel extends CurrencyAmount {
  label: string | null;
}
