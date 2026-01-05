export interface SniperReport {
  code: number;
  success: boolean;
  message: string;
  data: {
    analytics: SniperReportAnalytics;
    details: {
      count: number;
      items: SniperReportDetail[];
    };
  };
}

export interface CurrencyAmount {
  count: number;
  amount: number;
  amount_currency: string;
}

export interface SniperReportDetail {
  full_name: string;
  sniper_key: string;
  count: number;
  type_counts: Record<string, number>;
  date: string; // "2025-11-16"
  year_month: string;
}

export interface SniperReportAnalytics {
  count: number;
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
    full_name: Record<
      string,
      {
        count: number;
        total_count: number;
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
