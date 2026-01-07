export interface SponsorUnilevelResponse {
  code: number;
  success: boolean;
  message: string;
  data: GenerationResponse;
}

export interface GenerationResponse {
  generations: Generation[];
  total_members: number;
}

export interface Generation {
  level: number;
  count: number;
  members: GenerationMember[];
}

export interface GenerationMember {
  id: string;
  attribute: MemberAttribute;
}

export interface MemberAttribute {
  nama: string;
  username: string;
  email: string;
  no_hp: string;
  parent_id: string;
  sponsor_id: string;
  level: number;

  point_left: number;
  point_right: number;
  bonus_pairing: number;

  province: string;
  city: string;

  nik: string;
  npwp_name: string;
  npwp_number: string;
  npwp_address: string;

  heir_name: string;
  heir_relationship: string;

  code_bank: string;
  nama_bank: string | null;
  no_rekening: string;
  nama_pemilik_rekening: string;

  role: 'member' | 'admin' | string;

  status: MemberStatus;
  stockist: StockistInfo;

  created_at: string; // consider Date if parsed
}

export interface MemberStatus {
  code: number;
  name: string;
}

export interface StockistInfo {
  hasData: boolean;
  isPending: boolean;
}
