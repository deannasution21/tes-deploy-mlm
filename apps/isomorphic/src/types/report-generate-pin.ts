export interface ActivityReportResponse {
  code: number;
  success: boolean;
  message: string;
  data: ActivityReportData;
}

export interface ActivityReportData {
  analytics: Analytics;
  details: ActivityDetails;
}

export interface Analytics {
  count: number;
  total: BasicAmount;
  min: BasicAmount;
  max: BasicAmount;
  filter: AnalyticsFilter;
  data_grouped: AnalyticsGrouped;
}

export interface BasicAmount {
  amount: number;
}

export interface AnalyticsFilter {
  type: string;
  period: string;
  date_range: DateRange;
  year_month: YearMonthLabel;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface YearMonthLabel {
  raw: string;
  label: string;
}

export interface AnalyticsGrouped {
  username: Record<string, GroupedValue>;
  date: Record<string, GroupedValue>;
  year_month: Record<string, GroupedValue>;
}

export interface GroupedValue {
  count: number;
  total: number;
}

export interface ActivityDetails {
  count: number;
  items: ActivityItem[];
}

export interface ActivityItem {
  date: string;
  username: string;
  content_type_id: string;
  action: string;
  action_status: string;
  from: string;
  to: string;
  total_pin: number;
  details: string;
  year_month: string;
}
