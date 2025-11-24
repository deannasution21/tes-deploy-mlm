import {
  AmountCountCurrency,
  AmountCurrency,
  BankAccount,
  Withdrawal,
} from '.';
import { BalanceSummary } from './wd-bonus';

export interface WithdrawalSummaryResponse {
  code: number;
  success: boolean;
  message: string;
  data: WithdrawalSummaryData;
}

export interface WithdrawalSummaryData {
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
  can_withdrawal_salary: CanWithdrawSalary;
  detail_salary_withdrawal: DetailSalaryWithdrawal;
}

export interface UserPoint {
  point_left: number;
  point_right: number;
  bonus_pairing: number;
  bonus_flushed: number;
  total_point: number;
  bonus_salary: number;
}

export interface CanWithdrawSalary {
  can_withdrawal: boolean;
  remaining_count: number;
}

export interface DetailSalaryWithdrawal {
  total_point: number;
  points_used: number;
  remaining_points: number;
  salary_balance: AmountCurrency;
}

export interface SummaryItem {
  username: string;
  name: string;
  plan: string;
  commission_report: SummarySalaryCommission;
  withdrawal: Withdrawal;
  balance: AmountCurrency;
  commission_log: SummarySalaryCommissionLog;
  difference: SummarySalaryCommission;
}

export interface SummarySalaryCommission {
  salary?: AmountCurrency;
  total: AmountCurrency;
}

export interface SummarySalaryCommissionLog {
  salary?: AmountCountCurrency;
  total: AmountCountCurrency;
}
