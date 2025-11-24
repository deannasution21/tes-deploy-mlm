import {
  AmountCountCurrency,
  AmountCurrency,
  BankAccount,
  Withdrawal,
} from '.';

export interface SummaryResponse {
  code: number;
  success: boolean;
  message: string;
  data: SummaryData;
}

export interface SummaryData {
  detail_users: DetailUsers;
  count: number;
  summary: SummaryItem[];
  balance: BalanceSummary;
}

export interface DetailUsers {
  type: string;
  username: string;
  name: string;
  point: UserPoint;
  bank_account: BankAccount;
}

export interface UserPoint {
  point_left: number;
  point_right: number;
  bonus_pairing: number;
  bonus_sponsor: number;
}

export interface SummaryItem {
  username: string;
  name: string;
  plan: string;
  commission_report: CommissionReport;
  withdrawal: Withdrawal;
  balance: BalanceSummary;
  commission_log: CommissionLog;
  difference: CommissionDifference;
}

export interface CommissionReport {
  pairing: AmountCurrency;
  sponsor: AmountCurrency;
  total: AmountCurrency;
}

export interface CommissionLog {
  pairing: AmountCountCurrency;
  sponsor: AmountCountCurrency;
  total: AmountCountCurrency;
}

export interface CommissionDifference {
  pairing: AmountCurrency;
  sponsor: AmountCurrency;
  total: AmountCurrency;
}

export interface BalanceSummary {
  amount: number;
  currency: string;
  user_count_not_zero_amount?: number; // exists only in summary.data.balance
}
