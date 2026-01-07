export interface UserChangesListResponse {
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
    list: UserChangesListItem[];
  };
}

export interface UserChangesListItem {
  index: number;
  id: string;
  attribute: RequestAttribute;
}

export interface RequestAttribute {
  request_id: string;
  username: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  type: 'member' | string;
  apply_to_all_same_account: boolean;
  changes: ChangeLog[];
  updated_data: UpdatedData;
  requested_at: string;
  requested_by: string;
  accepted_at: string | null;
  accepted_by: string | null;
  rejected_at: string | null;
  rejected_by: string | null;
}

export interface ChangeLog {
  changed_at: string;
  old_value: string;
  field: string;
  new_value: string;
}

export interface UpdatedData {
  account_number: string;
  bank_code: string;
  no_hp: string;
  city: string;
  heir_relationship: string;
  heir_name: string;
  npwp_address: string;
  npwp_number: string;
  nik: string;
  npwp_name: string;
  nama: string;
  province: string;
  account_name: string;
  email: string;
}
