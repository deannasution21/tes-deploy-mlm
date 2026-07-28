export interface PromoMemberPasifResponse {
  code: number;
  success: boolean;
  message: string;
  data: PromoMemberPasifData;
}

export interface PromoMemberPasifData {
  promo_config_id: string;
  promo_config_type: string;
  promo_config_key: string;
  promo_name: string;
  promo_status: 'active' | 'inactive' | string;
  note: string;
  period: {
    start_date: string; // ISO datetime
    end_date: string; // ISO datetime
  };
  member_rules: {
    can_earn_base_salary: boolean;
    can_activate_to_normal: boolean;
    can_earn_reward_point: boolean;
    can_earn_pairing_bonus: boolean;
    can_earn_sponsor_bonus: boolean;
    can_withdraw_bonus: boolean;
  };
  activation: {
    required_action: string;
    description: string;
  };
  excluded_plans: string[];
  join_fee: number;
  user: {
    username: string;
    type_plan: string;
    member_pasif: boolean;
    point_pasif_left: number;
    point_pasif_right: number;
    effective_point: number;
  };
  progress: {
    promo_progress_id: string;
    promo_progress_key: string;
    point_pasif_left: number;
    point_pasif_right: number;
    effective_point: number;
    achieved_tiers: string[];
    updt_at: string | null;
  };
  reward_tiers: PromoMemberPasifRewardTier[];
  achieved_rewards: unknown[];
}

export interface PromoMemberPasifRewardTier {
  id: string;
  name: string;
  point_required: number;
  status: 'locked' | 'eligible' | 'claimed' | string;
  can_claim: boolean;
  achieved_at: string | null;
  report_key: string | null;
  progress: {
    effective_point: number;
    remaining: number;
    percent: number;
  };
}
