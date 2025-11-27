export interface LeaderboardResponse {
  code: number;
  success: boolean;
  message: string;
  data: LeaderboardData;
}

export interface LeaderboardData {
  total: number;
  leaderboards: LeaderboardItem[];
}

export interface LeaderboardItem {
  key: number;
  username: string;
  attribute: LeaderboardAttribute;
}

export interface LeaderboardAttribute {
  created_at: string;
  name: string;
  amount: CurrencyAmount;
  bank_detail: BankDetail;
  type: LeaderboardType;
}

export interface CurrencyAmount {
  amount: number;
  currency: string;
}

export interface BankDetail {
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
}

export interface LeaderboardType {
  leaderboard: string;
  label: string;
}
