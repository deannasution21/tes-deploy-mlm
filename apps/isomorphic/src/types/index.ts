import { CouponType } from '@/config/enums';
import { StaticImageData } from 'next/image';

export interface Coupon {
  id: string;
  name: string;
  type: CouponType;
  slug: string;
  amount?: string;
  code?: string;
}

export interface Address {
  customerName?: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  street?: string;
}

export interface GoogleMapLocation {
  lat?: number;
  lng?: number;
  street_number?: string;
  route?: string;
  street_address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  formattedAddress?: string;
}

export type ProductColor = {
  name?: string;
  code?: string;
};

export interface CartItem {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  image: string;
  color?: ProductColor | null;
  price: number;
  salePrice?: number;
  quantity: number;
  size: number;
  stock?: number;
  discount?: number;
}

export type Product = {
  id: number;
  slug?: string;
  title: string;
  description?: string;
  price: number;
  sale_price?: number;
  thumbnail: string;
  colors?: ProductColor[];
  sizes?: number[];
};

export type PosProduct = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  salePrice: number;
  quantity: number;
  size: number;
  discount?: number;
};
export interface CalendarEvent {
  id?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  title: string;
  description?: string;
  location?: string;
}

export interface FlightingCardProps {
  id: number;
  image: string;
  title: string;
  price: string;
  meta?: {
    model: string;
    hours: string;
    stop: string;
  };
  class: string;
  bucket: {
    luggage?: string;
    bag?: string;
  };
  airlines?: string;
  routes?: {
    arrivalDate: Date | string;
    arrivalTime: Date | string;
    departureDate: Date | string;
    departureTime: Date | string;
    departureCityCode: string;
    departureCity: string;
    departureTerminal: string;
    arrivalCityCode: string;
    arrivalCity: string;
    arrivalTerminal: string;
    layover: {
      layoverCityCode: string;
      layoverCity: string;
      layoverTerminal: string;
      layoverTime: string;
    }[];
  };
  cheapest?: boolean;
  best?: boolean;
  quickest?: boolean;
}

export interface ProductResponse {
  code: number;
  success: boolean;
  message: string;
  data: ProductItem[];
}

export interface ProductDetailResponse {
  code: number;
  success: boolean;
  message: string;
  data: ProductItem;
}

export interface ProductItem {
  product_id: string;
  attribute: ProductAttribute;
}

export interface ProductAttribute {
  name: string;
  stock: number;
  stock_pin?: number;
  description: string;
  price: ProductPrice;
}

export interface ProductPrice {
  amount: number;
  currency: string;
}

export interface ProductCartItem extends ProductAttribute {
  id: string;
  slug: string;
  quantity: number;
  image: string | StaticImageData;
  size?: number;
  discount?: number;
}

export interface UserDataResponse {
  code: number;
  success: boolean;
  message: string;
  data?: {
    attribute?: UserData;
  };
}

export interface UserData {
  nama: string;
  username: string;
  email?: string; // made optional, since not always in response
  no_hp: string;
  nama_bank: string;
  no_rekening: string;
  nama_pemilik_rekening: string;
  role: string;
  status: {
    code: number;
    name: string;
  };

  // 🆕 optional new fields from API
  parent_id?: string;
  sponsor_id?: string;
  level?: number;
  point_left?: number;
  point_right?: number;
  bonus_pairing?: number;
  province?: string;
  city?: string;
  nik?: string;
  npwp_name?: string | null;
  npwp_number?: string | null;
  npwp_address?: string | null;
  heir_name?: string | null;
  heir_relationship?: string | null;
  code_bank?: string;
  created_at?: string;

  // stockist
  stockist?: {
    hasData: boolean;
    isPending: boolean;
  };
}

export interface PinResponse {
  code: number;
  success: boolean;
  message: string;
  data: {
    count: number;
    pins: Pin[];
  };
}

export interface Pin {
  pin_code: string;
  mlm_user_id: string;
  dealer_id: string;
  type: string;
  price: {
    amount: number;
    currency: string;
  };
  status: string;
  created_at: string; // you can change to Date if you parse it later
}

export interface TransferPinResponse {
  code: number;
  success: boolean;
  message: string;
  data: {
    transferredPins: string[];
  };
}

export interface HistoryTransferPinResponse {
  code: number;
  success: boolean;
  message: string;
  data: {
    count: number;
    histories: HistoryTransferPinItem[];
  };
}

export interface HistoryTransferPinItem {
  pin_code: string;
  attributes: HistoryTransferPinAttributes;
}

export interface HistoryTransferPinAttributes {
  created_at: string;
  from: string;
  to: string;
  total_pin: number;
  note: string;
  type_pin: string;
  status: string;
}

export interface NetworkDiagramResponse {
  code: number;
  success: boolean;
  message: string;
  data: NetworkNode;
}

export interface NetworkNode {
  user_id: string | null;
  name: string | null;
  location: string | null;
  position: 'left' | 'right' | null;
  point_left: number;
  point_right: number;
  upline: string;
  isPlaceholder: boolean;
  hasData: boolean;
  children?: NetworkNode[]; // recursive structure
  childrenCount?: number;
}

export interface PaymentMethodResponse {
  code: number;
  success: boolean;
  message: string;
  data: PaymentData;
}

export interface PaymentData {
  va: PaymentItem[];
  qris: PaymentItem[];
}

export interface PaymentItem {
  id: string;
  payment_method: string; // e.g. "virtual_account", "wallet_account"
  payment_channel: string; // e.g. "bca", "bni", "qris"
  percentage_type: 'fix' | 'percentage';
  fee: PaymentFee;
}

export interface PaymentFee {
  value: number;
  formatted: string; // e.g. "Rp 3.000,00" or "0.7%"
}

export interface PaymentOption {
  value: string;
  label: string;
  fee?: number;
}

export interface BankStatusResponse {
  code: number;
  success: boolean;
  message: string;
  data: BankData[];
}

export interface BankData {
  bank_code: string;
  name: string;
  fee: number;
  queue: number;
  status: BankStatus;
}

export type BankStatus = 'OPERATIONAL' | 'DISTURBED' | 'HEAVILY_DISTURBED';

export interface OptionType {
  value: string;
  label: string;
}

export interface Province {
  id: string;
  name: string;
}

export interface Regencies {
  id: string;
  province_id: string;
  name: string;
}

export interface Districs {
  id: string;
  regency_id: string;
  name: string;
}

export interface Villages {
  id: string;
  district_id: string;
  name: string;
}

// Root response
export interface TransactionResponse {
  code: number;
  success: boolean;
  message: string;
  data: TransactionData;
}

export interface TransactionWDResponse {
  code: number;
  success: boolean;
  message: string;
  data: TransactionWDData;
}

// Data object
export interface TransactionData {
  detail_users: DetailUser;
  count: number;
  summary: UserSummary[];
}

// Transaction data
export interface TransactionWDData {
  username: string;
  name: string;
  plan: string;
  bank_account: BankAccount;
  commission_report: CommissionReport;
  commission_log: CommissionLog;
  difference: Difference;
  withdrawal: Withdrawal;
  balance: Balance;
}

export interface BankAccount {
  bank_name: string;
  account_number: string;
  account_name: string;
}

// User details (main user info)
export interface DetailUser {
  type: string;
  username: string;
  name: string;
  bank_name: string;
  account_number: string;
  account_name: string;
}

// Summary per user
export interface UserSummary {
  username: string;
  name: string;
  plan: string;
  commission_report: CommissionReport;
  commission_log: CommissionLog;
  difference: Difference;
  withdrawal: Withdrawal;
  balance: Balance;
}

// Commission report
export interface CommissionReport {
  pairing: AmountCurrency;
  sponsor: AmountCurrency;
  total: AmountCurrency;
}

// Commission log
export interface CommissionLog {
  pairing: AmountCountCurrency;
  sponsor: AmountCountCurrency;
  total: AmountCurrency;
}

// Difference
export interface Difference {
  pairing: AmountCurrency;
  sponsor: AmountCurrency;
  total: AmountCurrency;
}

// Withdrawal
export interface Withdrawal {
  amount: number;
  count: number;
  currency: string;
}

// Balance
export interface Balance {
  amount: number;
  currency: string;
}

// Helper types
export interface AmountCurrency {
  amount: number;
  currency: string;
}

export interface AmountCountCurrency extends AmountCurrency {
  count: number;
}

// types/Transaction.ts
export interface HistoryBonusResponse {
  code: number;
  success: boolean;
  message: string;
  data: HistoryBonusData;
}

export interface HistoryBonusData {
  count: number;
  bonus_sponsor: BonusCategory;
  bonus_pairing: BonusCategory;
  grand_total: GrandTotal;
}

export interface GrandTotal {
  sponsor: AmountCurrency;
  pairing: AmountCurrency;
  total: AmountCurrency;
}

export interface BonusCategory {
  count: number;
  total: AmountCurrency;
  items: BonusItem[];
}

export interface BonusItem {
  username: string;
  attribute: BonusAttribute;
}

export interface BonusAttribute {
  plan: string;
  created_at: string; // ISO or formatted date string
  from: string;
  total: AmountCurrency;
  description: string;
  type: 'bonus_sponsor' | 'bonus_pairing';
}

export interface WithdrawalSummaryResponse {
  code: number;
  success: boolean;
  message: string;
  data: WithdrawalSummaryData;
  token: string;
}

export interface WithdrawalSummaryData {
  detail_users: WithdrawalUserDetail;
  count: number;
  summary: WithdrawalSummaryItem[];
}

export interface WithdrawalUserDetail {
  type: string; // e.g., "plan_a"
  username: string;
  name: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  point: Point;
}

export interface Point {
  point_left: number;
  point_right: number;
  bonus_pairing: number;
  bonus_flushed: number;
  total_point: number;
  bonus_salary: number;
}

export interface WithdrawalSummaryItem {
  username: string;
  name: string;
  plan: string;
  commission_report: CommissionSection;
  withdrawal: WithdrawalSection;
  balance: AmountCurrency;
  commission_log: CommissionSection;
  difference: CommissionSection;
}

export interface CommissionSection {
  salary: WithdrawalSection;
  total: AmountCurrency;
}

export interface WithdrawalSection {
  amount: number;
  count: number;
  currency: string;
}
