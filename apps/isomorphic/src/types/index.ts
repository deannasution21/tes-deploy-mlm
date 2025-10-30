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
  email: string;
  no_hp: string;
  nama_bank: string;
  no_rekening: string;
  nama_pemilik_rekening: string;
  role: string;
  status: {
    code: number;
    name: string;
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
