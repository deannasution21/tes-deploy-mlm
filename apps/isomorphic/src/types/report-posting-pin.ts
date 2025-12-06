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
  items: PostingActivityItem[];
}

export interface PostingActivityItem {
  date: string; // "2025-11-17"
  username: string; // "ipg0000003"
  content_type_id: string; // "add_child_node"
  action: string; // "Add Child Node"
  action_status: string; // "SUCCESS"
  mlm_user_id?: string; // "ipg0000009"
  position?: string; // "left" | "right"
  details: string;
  year_month: string; // "202511"
}
