export interface WithdrawalBonusReport {
  code: number;
  success: boolean;
  message: string;
  data: {
    analytics: WithdrawalBonusReportAnalytics;
    details: {
      count: number;
      items: WithdrawalBonusReportDetail[];
    };
  };
}

export interface CurrencyAmount {
  amount: number;
  amount_currency: string;
}

export interface WithdrawalBonusReportDetail {
  date: string; // "2025-11-16"
  username: string;
  withdrawal: CurrencyAmount;
  type: string; // e.g. "withdrawal_bonus"
  year_month: string;
}

export interface WithdrawalBonusReportAnalytics {
  count: number;
  total: CurrencyAmount;
  min: CurrencyAmount;
  max: CurrencyAmount;
  filter: {
    type: string;
    period: string;
    date_range: {
      start: string; // "2025-11-01"
      end: string; // "2025-11-30"
    };
    year_month: {
      raw: string; // "202511"
      label: string; // "November 2025"
    };
  };
  data_grouped: {
    username: Record<
      string,
      {
        count: number;
        total: number;
        total_currency: string;
      }
    >;
    date: Record<
      string,
      {
        count: number;
        total: number;
        total_currency: string;
      }
    >;
    year_month: Record<
      string,
      {
        count: number;
        total: number;
        total_currency: string;
      }
    >;
  };
}
