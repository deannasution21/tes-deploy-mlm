import { LockStatus } from '@/config/plans';

// GET /_transactions/withdrawal-summary?type=free&category=reward
export interface RewardPasifResponse {
  code: number;
  success: boolean;
  message: string;
  data: RewardPasifData;
}

export interface RewardPasifData {
  category: 'reward';
  type: 'free';
  detail_users: RewardPasifUser;
  reward_config_key?: string;
  lock_rules_active?: boolean;
  reward_tiers: RewardPasifTier[];
}

export interface RewardPasifUser {
  username: string;
  name: string;
  type_plan: string;
  track_active?: boolean;
  can_claim_reward: boolean;
  point_pasif_left?: number;
  point_pasif_right?: number;
  effective_point: number;
  claimed_total: number;
}

export type RewardTierStatus =
  | 'not_reached'
  | 'pending'
  | 'locked'
  | 'eligible'
  | 'claimed'
  | 'expired';

export interface RewardPasifTier {
  id: string;
  name: string;
  point_required: number;
  amount: number;
  status: RewardTierStatus;
  lock_status: LockStatus | null;
  claim_status?: string | null;
  expires_at: string | null;
  no_expiry?: boolean;
  achieved_at?: string | null;
  can_claim: boolean;
  progress?: {
    effective_point: number;
    remaining: number;
    percent: number;
  };
}

// POST /_transactions { type: 'claim_reward', tier_id, type_plan: 'free' }
export interface ClaimRewardResponse {
  code: number;
  message: string;
  data: {
    status: 'claimed';
    tier: { id: string; name: string; amount: number };
    claimed_at: string;
    claimed_by: string;
  };
}
