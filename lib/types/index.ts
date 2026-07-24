// Nyasawallet Type Definitions

export type TransactionType = 'deposit' | 'send' | 'buy' | 'sell' | 'referral_bonus' | 'withdrawal' | 'exchange';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
export type TransactionMethod = 'mobile_money' | 'bank_transfer' | 'usdt' | 'card' | 'referral';
export type KycStatus = 'unverified' | 'pending' | 'approved' | 'rejected';
export type WalletStatus = 'active' | 'frozen' | 'closed';
export type WalletType = 'usdt' | 'local' | 'savings';
export type CardStatus = 'active' | 'frozen' | 'closed' | 'pending';
export type CardType = 'virtual' | 'physical';
export type SupportStatus = 'open' | 'pending' | 'resolved' | 'closed';
export type SupportPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ReferralStatus = 'pending' | 'completed' | 'rewarded';
export type UserRole = 'user' | 'admin' | 'super_admin';

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  date_of_birth: string | null;
  id_number: string | null;
  id_type: string | null;
  role: UserRole;
  status: string;
  kyc_status: KycStatus;
  referral_code: string | null;
  referred_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  type: WalletType;
  status: WalletStatus;
  wallet_address: string | null;
  currency: string;
  locked_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  wallet_id: string | null;
  type: TransactionType;
  status: TransactionStatus;
  method: TransactionMethod | null;
  amount: number;
  fee: number;
  currency: string;
  local_amount: number | null;
  local_currency: string | null;
  exchange_rate: number | null;
  country: string | null;
  phone_number: string | null;
  account_name: string | null;
  account_number: string | null;
  bank_name: string | null;
  wallet_address: string | null;
  network: string | null;
  tx_hash: string | null;
  reference: string | null;
  recipient_email: string | null;
  sender_email: string | null;
  payment_provider: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CountryRate {
  id: string;
  country: string;
  country_code: string;
  currency: string;
  buy_rate: number;
  sell_rate: number;
  margin: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GatewayConfig {
  id: string;
  provider_name: string;
  provider_type: string | null;
  api_key: string | null;
  secret_key: string | null;
  webhook_url: string | null;
  callback_url: string | null;
  environment: string;
  is_active: boolean;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface VirtualCard {
  id: string;
  user_id: string;
  card_number: string | null;
  card_holder: string | null;
  expiry_month: string | null;
  expiry_year: string | null;
  cvv: string | null;
  balance: number;
  type: CardType;
  status: CardStatus;
  spending_limit: number | null;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface KycSubmission {
  id: string;
  user_id: string;
  document_type: string | null;
  document_number: string | null;
  document_front_url: string | null;
  document_back_url: string | null;
  selfie_url: string | null;
  proof_of_address_url: string | null;
  country: string | null;
  status: KycStatus;
  rejection_reason: string | null;
  reviewed_by: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string | null;
  category: string | null;
  priority: SupportPriority;
  status: SupportStatus;
  assigned_to: string | null;
  ai_handled: boolean;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  user_id: string | null;
  message: string;
  is_from_user: boolean;
  is_ai: boolean;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string | null;
  referral_code: string;
  status: ReferralStatus;
  bonus: number;
  rewarded_at: string | null;
  created_at: string;
}

export interface WalletSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  description: string | null;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BalanceSnapshot {
  id: string;
  user_id: string;
  wallet_id: string;
  balance: number;
  currency: string | null;
  snapshot_type: string;
  created_at: string;
}

// Supported countries with their config
export const COUNTRIES = [
  { code: 'MW', name: 'Malawi', currency: 'MWK', flag: '🇲🇼', mobileMoney: ['Airtel Money', 'TNM Mpam'] },
  { code: 'KE', name: 'Kenya', currency: 'KES', flag: '🇰🇪', mobileMoney: ['M-Pesa', 'Airtel Money'] },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', flag: '🇳🇬', mobileMoney: ['Paystack', 'Flutterwave'] },
  { code: 'GH', name: 'Ghana', currency: 'GHS', flag: '🇬🇭', mobileMoney: ['MTN Mobile Money', 'AirtelTigo'] },
  { code: 'ET', name: 'Ethiopia', currency: 'ETB', flag: '🇪🇹', mobileMoney: ['CBE', 'Dashen'] },
  { code: 'MZ', name: 'Mozambique', currency: 'MZN', flag: '🇲🇿', mobileMoney: ['M-Pesa', 'e-Mola'] },
  { code: 'RW', name: 'Rwanda', currency: 'RWF', flag: '🇷🇼', mobileMoney: ['MTN Mobile Money', 'Airtel Money'] },
  { code: 'TZ', name: 'Tanzania', currency: 'TZS', flag: '🇹🇿', mobileMoney: ['M-Pesa', 'Airtel Money', 'Halopesa'] },
  { code: 'UG', name: 'Uganda', currency: 'UGX', flag: '🇺🇬', mobileMoney: ['MTN Mobile Money', 'Airtel Money'] },
  { code: 'ZM', name: 'Zambia', currency: 'ZMW', flag: '🇿🇲', mobileMoney: ['Airtel Money', 'MTN Mobile Money'] },
  { code: 'ZW', name: 'Zimbabwe', currency: 'ZWL', flag: '🇿🇼', mobileMoney: ['EcoCash', 'OneMoney'] },
] as const;

export const USDT_NETWORKS = [
  { id: 'trc20', name: 'TRC20 (Tron)', fee: 1, confirmations: 1 },
  { id: 'erc20', name: 'ERC20 (Ethereum)', fee: 5, confirmations: 12 },
  { id: 'bsc', name: 'BSC (Binance Smart Chain)', fee: 0.5, confirmations: 3 },
  { id: 'polygon', name: 'Polygon', fee: 0.1, confirmations: 3 },
] as const;
