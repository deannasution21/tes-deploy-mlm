export interface UserListResponse {
  code: number;
  success: boolean;
  message: string;
  data: {
    meta: {
      total: number;
      current_page: number;
      per_page: number;
      last_page: number;
    };
    list: UserListItem[];
  };
}

export interface UserListItem {
  id: string;
  attribute: UserAttributes;
}

export interface UserAttributes {
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
  npwp_name: string | null;
  npwp_number: string | null;
  npwp_address: string | null;

  // These are currently strings like "[object Object]"
  // If backend should send real objects, update accordingly.
  heir_name: string | null;
  heir_relationship: string | null;

  code_bank: string;
  nama_bank: string | null;
  no_rekening: string;
  nama_pemilik_rekening: string;
  role: string;

  status: {
    code: number;
    name: string;
  };

  stockist: {
    hasData: boolean;
    isPending: boolean;
  };

  created_at: string;
}
