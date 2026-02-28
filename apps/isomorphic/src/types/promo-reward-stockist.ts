/* =========================
   ROOT API RESPONSE
========================= */

export interface PromoStatusResponse {
  code: number;
  success: boolean;
  message: string;
  data: {
    promos: PromoStatusData[];
  };
}

/* =========================
   MAIN DATA
========================= */

export interface PromoStatusData {
  meta: PromoMeta;
  period: PromoPeriod;
  progress_summary: PromoProgressSummary;
  tiers: PromoTiers;
  rules: PromoRules;
  promo_config_raw: PromoConfigRaw;
  progress_raw: PromoProgressRaw;
}

/* =========================
   META
========================= */

export interface PromoMeta {
  promo_config_id: string;
  username: string;
  role: 'stockist' | 'user' | string;
  status: 'active' | 'inactive' | string;
  is_promo: number;
  progress_exists: boolean;
}

/* =========================
   PERIOD
========================= */

export interface PromoPeriod {
  mode: string;
  first_order_at: string; // ISO datetime
  period_start: string; // YYYY-MM-DD
  period_end: string; // YYYY-MM-DD
  last_counted_order_id: string;
}

/* =========================
   PROGRESS SUMMARY
========================= */

export interface PromoProgressSummary {
  accumulate_pin: number;
  tier_reached: number;
  reward_reached: string;
  claimed: PromoClaimed;
  stats: PromoStats;
}

export interface PromoClaimed {
  claimed_tier: number;
  claimed_reward: string;
  claimed_at: string;
  is_claimed: boolean;
}

export interface PromoStats {
  order_count: number;
  amount_counted: number;
  pin_counted: number;
}

/* =========================
   TIERS
========================= */

export interface PromoTiers {
  targets: PromoTierTarget[];
  current_tier: PromoTierTarget | null;
  next_target: PromoTierTarget;
  remaining_to_next: number;
}

export interface PromoTierTarget {
  accumulate_pin: number;
  reward: string;
}

/* =========================
   RULES
========================= */

export interface PromoRules {
  excluded_products: string[];
  decision_rule: PromoDecisionRule;
  duration_days: number;
}

export interface PromoDecisionRule {
  reward_policy: 'highest_tier' | string;
  claim_policy: 'once_per_period' | string;
}

/* =========================
   PROMO CONFIG RAW
========================= */

export interface PromoConfigRaw {
  is_promo: number;
  rules: PromoConfigRules;
  crtd_at: string;
  updt_at: string;
  status: string;
  channels: PromoChannels;
  promo_config_id: string;
  decision_rule: PromoDecisionRule;
  excluded_products: string[];
  description: string;
  name: string;
  promo_config_key: string;
}

export interface PromoConfigRules {
  period_mode: string;
  count_source: string;
  count_unit: string;
  first_order_anchor_field: string;
  only_hq_orders: boolean;
  excluded_products: string[];
  period_days: number;
  eligible_actor: string;
  accumulation_basis: string;
}

/* =========================
   CHANNELS
========================= */

export interface PromoChannels {
  stockist?: PromoChannel;
  user?: PromoChannel;
  [key: string]: PromoChannel | undefined;
}

export interface PromoChannel {
  targets: PromoTierTarget[];
  period: PromoChannelPeriod;
}

export interface PromoChannelPeriod {
  type: string;
  duration_days: number;
  start_from: string;
}

/* =========================
   PROGRESS RAW
========================= */

export interface PromoProgressRaw {
  crtd_at: string;
  updt_at: string;
  channels: PromoProgressChannels;
  username: string;
  promo_progress_id: string;
  promo_progress_key: string;
  promo_snapshot: PromoSnapshot;
}

export interface PromoProgressChannels {
  pin?: PromoProgressChannel;
  [key: string]: PromoProgressChannel | undefined;
}

export interface PromoProgressChannel {
  period_start: string;
  period_end: string;
  first_order_at: string;
  last_order_at: string;
  last_counted_order_id: string;
  accumulate_pin: number;
  tier_reached: number;
  reward_reached: string;
  claimed_tier: number;
  claimed_reward: string;
  excluded_products: string[];
  stats: PromoStats;
}

/* =========================
   PROMO SNAPSHOT
========================= */

export interface PromoSnapshot {
  promo_config_id: string;
  name: string;
  duration_days: number;
  decision_rule: PromoDecisionRule;
  description: string;
  excluded_products: string[];
  targets: PromoTierTarget[];
  is_promo: number;
  status: string;
}
