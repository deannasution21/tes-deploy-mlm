// Paket member / PIN. Satu sumber label supaya tidak hardcoded di tiap file.
// free   = Pendaftaran / Pasif (PIN Rp25.000)
// plan_b = Star               (PIN Rp200.000)
// plan_a = Business           (PIN Rp500.000)
export type TypePlan = 'free' | 'plan_b' | 'plan_a';

export const PLAN_LABEL: Record<TypePlan, string> = {
  free: 'Pendaftaran',
  plan_b: 'Star',
  plan_a: 'Business',
};

// urutan dari paket terendah ke tertinggi
export const PLAN_OPTIONS: { value: TypePlan; label: string }[] = [
  { value: 'free', label: PLAN_LABEL.free },
  { value: 'plan_b', label: PLAN_LABEL.plan_b },
  { value: 'plan_a', label: PLAN_LABEL.plan_a },
];

// pilihan plan di halaman withdrawal bonus & gaji (Pasif tidak bisa WD)
export const WD_PLAN_OPTIONS = PLAN_OPTIONS.filter((p) => p.value !== 'free');

// API kadang kirim "PLAN A" / "PLAN B" / "FREE" (riwayat komisi)
export function normalizePlan(plan?: string | null) {
  return plan?.trim().toLowerCase().replace(/\s+/g, '_') ?? '';
}

export function getPlanLabel(plan?: string | null) {
  return PLAN_LABEL[normalizePlan(plan) as TypePlan] ?? plan ?? '-';
}

export function getPinLabel(plan?: string | null) {
  return `PIN ${getPlanLabel(plan)}`;
}

export function isValidPlan(plan?: string | null): plan is TypePlan {
  return !!plan && plan in PLAN_LABEL;
}

// syarat gaji berulang per paket (kelipatan, tanpa batas)
export const SALARY_RULE: Partial<
  Record<TypePlan, { point: number; amount: string; note?: string }>
> = {
  plan_b: {
    point: 50,
    amount: 'Rp 1.000.000',
    note: 'Gaji pertama dari paket Star terkunci dan baru dibayarkan setelah upgrade ke Business.',
  },
  plan_a: { point: 30, amount: 'Rp 1.500.000' },
};

// keuntungan per paket untuk ditampilkan di Upgrade Paket (sumber: materi klien)
export const PLAN_BENEFITS: Partial<Record<TypePlan, string[]>> = {
  plan_b: [
    'Bonus Sponsor Rp20.000',
    'Bonus Pasangan Rp10.000 / pasang',
    'Flush in 200 pasang / hari (Rp2.000.000 / hari)',
    'Gaji berulang setiap 50 : 50 = Rp1.000.000, tanpa batas',
  ],
  plan_a: [
    'Bonus Sponsor 5 generasi (Gen 1 Rp50.000, Gen 2–5 Rp10.000)',
    'Bonus Pasangan Rp40.000 / pasang',
    'Flush in maks. 50 pasang / hari (Rp2.000.000 / hari)',
    'Gaji berulang setiap 30 : 30 = Rp1.500.000, tanpa batas',
    'Berhak klaim semua reward & bonus yang terkunci',
  ],
};

// status komisi / tier dari backend
export type LockStatus = 'ACTIVE' | 'LOCKED' | 'EXPIRED';

export const LOCK_STATUS_LABEL: Record<LockStatus, string> = {
  ACTIVE: 'Cair',
  LOCKED: 'Terkunci',
  EXPIRED: 'Hangus',
};

export const LOCK_STATUS_COLOR: Record<
  LockStatus,
  'success' | 'warning' | 'danger'
> = {
  ACTIVE: 'success',
  LOCKED: 'warning',
  EXPIRED: 'danger',
};
