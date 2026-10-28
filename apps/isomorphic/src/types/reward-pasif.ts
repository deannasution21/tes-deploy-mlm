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
  // voucher yang sudah diklaim, siap dicetak
  claimed_vouchers?: VoucherDetail[];
  reward_tiers: RewardPasifTier[];
}

export type RewardType = 'voucher' | 'cash';

// dicetak di FE (bukan file dari backend)
export interface VoucherDetail {
  voucher_code: string;
  title: string;
  tier_id?: string;
  username?: string;
  holder_name: string;
  claimed_at: string;
  claimed_by?: string;
  status?: string;
  printable: boolean;
  note?: string;
}

export interface RewardPasifUser {
  username: string;
  name: string;
  // bisa null untuk akun lama; jangan dipakai untuk menentukan hak klaim,
  // gunakan can_claim_reward
  type_plan: string | null;
  track_active?: boolean;
  can_claim_reward: boolean;
  point_pasif_left?: number;
  point_pasif_right?: number;
  effective_point: number;
  claimed_total: number;
  // total reward tunai yang sudah ditarik & sisa saldo reward tunai
  // (belum ada di semua environment backend, jadi opsional)
  withdrawn_total?: number;
  balance?: number;
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
  reward_type?: RewardType;
  // pilihan saat klaim (cash / voucher); null sebelum diklaim
  claim_as?: RewardType | null;
  cash_amount?: number;
  prize_amount?: number;
  voucher?: string | null;
  voucher_detail?: VoucherDetail | null;
  claimed_at?: string | null;
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

// POST /_transactions { username, type: 'claim_reward', tier_id, type_plan: 'free' }
// hanya untuk diri sendiri & paket Business (plan_a), selain itu 400
export interface ClaimRewardResponse {
  code: number;
  message: string;
  data: {
    status: 'claimed';
    reward_type?: RewardType;
    voucher?: string | null;
    // null untuk reward cash
    voucher_detail?: VoucherDetail | null;
  };
}
