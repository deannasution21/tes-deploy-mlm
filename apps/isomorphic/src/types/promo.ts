export interface PromoStatusResponse {
  code: number;
  success: boolean;
  message: string;
  data: PromoData;
}

export interface PromoData {
  promo_name: string;
  promo_description: string;
  promo_status: 'active' | 'inactive';
  user_status: UserStatus;
  package_info: PackageInfo;
  selection_window: SelectionWindow;
  channels: Channel[];
  points_summary: PointsSummary;
  claimed_rewards: ClaimedRewards;
  downlines: Downline[];
}

export interface UserStatus {
  member_type: string;
  join_date: string; // YYYY-MM-DD
  active_downlines: number;
  qualified_for_promo: boolean;
}

export interface PackageInfo {
  current_package: number;
  package_status: string;
  decision_locked: boolean;
  joined_at: string; // DD-MM-YYYY HH:mm
  available_packages: AvailablePackage[];
}

export interface AvailablePackage {
  package_id: number;
  eligible_channels: ChannelType[];
  reward_policy: RewardPolicy;
  is_final: boolean;
}

export interface RewardPolicy {
  car: 'none' | 'choose_one';
  trip: 'none' | 'choose_one';
}

export interface SelectionWindow {
  status: string;
  start_date: string;
  end_date: string;
  deadline: string;
  days_remaining: number;
}

export type ChannelType = 'car' | 'trip';

export interface Channel {
  name: string;
  channel_id: ChannelType;
  status: string;
  is_active: boolean;
  period: ChannelPeriod;
  qualified: boolean;
  min_ids_required: number;
  rewards: ChannelReward[];
}

export interface ChannelPeriod {
  start: string;
  end: string;
}

export interface ChannelReward {
  requirement: string;
  reward: string;
}

export interface PointsSummary {
  points_calculation_starts: string;
  total_downlines: number;
  points_by_channel: PointsByChannel;
}

export interface PointsByChannel {
  car: ChannelPoints;
  trip: ChannelPoints;
}

export interface ChannelPoints {
  active_points: PointSide;
  held_points: HeldPoints;
}

export interface PointSide {
  left: number;
  right: number;
  pairs: number;
}

export interface HeldPoints {
  left: number;
  right: number;
  note?: string;
}

export interface ClaimedRewards {
  car: unknown[];
  trip: unknown[];
}

export interface Downline {
  username: string;
  name: string;
  plan: string;
  points: DownlinePoints;
}

export interface DownlinePoints {
  car: DownlineChannelPoints;
  trip: DownlineChannelPoints;
}

export interface DownlineChannelPoints {
  active: PointSide;
  held: HeldWithSince;
  effective_total: PointSide;
}

export interface HeldWithSince {
  left: number;
  right: number;
  since: string | null;
}
