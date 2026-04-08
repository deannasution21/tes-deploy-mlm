// 🔹 Root Response
export interface LeaderboardResponse {
  code: number;
  success: boolean;
  message: string;
  data: LeaderboardData;
}

// 🔹 Data Wrapper
export interface LeaderboardData {
  total: number;
  leaderboards: LeaderboardItem[];
}

// 🔹 Item
export interface LeaderboardItem {
  key: number;
  attribute: LeaderboardAttribute;
}

// 🔹 Attribute
export interface LeaderboardAttribute {
  created_at: string;
  name: string;
  amount: Amount;
  bank_detail: BankDetail;
  type: LeaderboardType;
}

// 🔹 Amount
export interface Amount {
  amount: number; // raw number (for logic)
  currency: string; // formatted (for UI)
}

// 🔹 Bank Detail
export interface BankDetail {
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
}

// 🔹 Type
export interface LeaderboardType {
  leaderboard: string; // e.g. "elite_builder"
  label: string; // e.g. "Elite Builder"
}
