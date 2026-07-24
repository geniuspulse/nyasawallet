-- Nyasawallet Database Schema
-- Pan-African digital wallet for USDT and local fiat currency

-- ========== EXTENSIONS ==========
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========== ENUMS ==========
CREATE TYPE transaction_type AS ENUM ('deposit', 'send', 'buy', 'sell', 'referral_bonus', 'withdrawal', 'exchange');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE transaction_method AS ENUM ('mobile_money', 'bank_transfer', 'usdt', 'card', 'referral');
CREATE TYPE kyc_status AS ENUM ('unverified', 'pending', 'approved', 'rejected');
CREATE TYPE wallet_status AS ENUM ('active', 'frozen', 'closed');
CREATE TYPE wallet_type AS ENUM ('usdt', 'local', 'savings');
CREATE TYPE card_status AS ENUM ('active', 'frozen', 'closed', 'pending');
CREATE TYPE card_type AS ENUM ('virtual', 'physical');
CREATE TYPE support_status AS ENUM ('open', 'pending', 'resolved', 'closed');
CREATE TYPE support_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE referral_status AS ENUM ('pending', 'completed', 'rewarded');
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');

-- ========== PROFILES ==========
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone_number TEXT,
  country TEXT,
  city TEXT,
  address TEXT,
  date_of_birth DATE,
  id_number TEXT,
  id_type TEXT,
  role user_role DEFAULT 'user',
  status TEXT DEFAULT 'active',
  kyc_status kyc_status DEFAULT 'unverified',
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== WALLETS ==========
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  balance DECIMAL(20,8) DEFAULT 0,
  type wallet_type DEFAULT 'usdt',
  status wallet_status DEFAULT 'active',
  wallet_address TEXT,
  currency TEXT DEFAULT 'USDT',
  locked_balance DECIMAL(20,8) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== TRANSACTIONS ==========
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_id UUID REFERENCES wallets(id) ON DELETE SET NULL,
  type transaction_type NOT NULL,
  status transaction_status DEFAULT 'pending',
  method transaction_method,
  amount DECIMAL(20,8) NOT NULL,
  fee DECIMAL(20,8) DEFAULT 0,
  currency TEXT DEFAULT 'USDT',
  local_amount DECIMAL(20,8),
  local_currency TEXT,
  exchange_rate DECIMAL(20,8),
  country TEXT,
  phone_number TEXT,
  account_name TEXT,
  account_number TEXT,
  bank_name TEXT,
  wallet_address TEXT,
  network TEXT,
  tx_hash TEXT,
  reference TEXT,
  recipient_email TEXT,
  sender_email TEXT,
  payment_provider TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== COUNTRY RATES ==========
CREATE TABLE country_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  currency TEXT NOT NULL,
  buy_rate DECIMAL(20,8) NOT NULL,
  sell_rate DECIMAL(20,8) NOT NULL,
  margin DECIMAL(10,4) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(country_code)
);

-- ========== GATEWAY CONFIGS ==========
CREATE TABLE gateway_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_name TEXT NOT NULL,
  provider_type TEXT,
  api_key TEXT,
  secret_key TEXT,
  webhook_url TEXT,
  callback_url TEXT,
  environment TEXT DEFAULT 'sandbox',
  is_active BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== VIRTUAL CARDS ==========
CREATE TABLE virtual_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  card_number TEXT,
  card_holder TEXT,
  expiry_month TEXT,
  expiry_year TEXT,
  cvv TEXT,
  balance DECIMAL(20,8) DEFAULT 0,
  type card_type DEFAULT 'virtual',
  status card_status DEFAULT 'pending',
  spending_limit DECIMAL(20,8),
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== KYC SUBMISSIONS ==========
CREATE TABLE kyc_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT,
  document_number TEXT,
  document_front_url TEXT,
  document_back_url TEXT,
  selfie_url TEXT,
  proof_of_address_url TEXT,
  country TEXT,
  status kyc_status DEFAULT 'pending',
  rejection_reason TEXT,
  reviewed_by UUID,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== SUPPORT TICKETS ==========
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT,
  category TEXT,
  priority support_priority DEFAULT 'medium',
  status support_status DEFAULT 'open',
  assigned_to UUID,
  ai_handled BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== SUPPORT MESSAGES ==========
CREATE TABLE support_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  is_from_user BOOLEAN DEFAULT true,
  is_ai BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== REFERRALS ==========
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code TEXT,
  status referral_status DEFAULT 'pending',
  bonus DECIMAL(20,8) DEFAULT 0,
  rewarded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== WALLET SETTINGS ==========
CREATE TABLE wallet_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  description TEXT,
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== BALANCE SNAPSHOTS ==========
CREATE TABLE balance_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  balance DECIMAL(20,8) NOT NULL,
  currency TEXT,
  snapshot_type TEXT DEFAULT 'daily',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== APP SETTINGS ==========
CREATE TABLE app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== INDEXES ==========
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_referral_code ON profiles(referral_code);
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_country_rates_country ON country_rates(country_code);
CREATE INDEX idx_virtual_cards_user_id ON virtual_cards(user_id);
CREATE INDEX idx_kyc_submissions_user_id ON kyc_submissions(user_id);
CREATE INDEX idx_kyc_submissions_status ON kyc_submissions(status);
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_messages_ticket_id ON support_messages(ticket_id);
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_balance_snapshots_user_id ON balance_snapshots(user_id);

-- ========== ROW LEVEL SECURITY ==========
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE balance_snapshots ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own wallets" ON wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wallets" ON wallets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wallets" ON wallets FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own cards" ON virtual_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cards" ON virtual_cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cards" ON virtual_cards FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own KYC" ON kyc_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own KYC" ON kyc_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own tickets" ON support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tickets" ON support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tickets" ON support_tickets FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own messages" ON support_messages FOR SELECT USING (auth.uid() = user_id OR ticket_id IN (SELECT id FROM support_tickets WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own messages" ON support_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own referrals" ON referrals FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "Users can insert own referrals" ON referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Users can view own snapshots" ON balance_snapshots FOR SELECT USING (auth.uid() = user_id);

-- Public tables (no RLS needed but we enable for safety)
ALTER TABLE country_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view country rates" ON country_rates FOR SELECT USING (true);

ALTER TABLE gateway_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view public app settings" ON app_settings FOR SELECT USING (is_public = true);

-- ========== ADMIN POLICIES (via service role or admin check) ==========
-- Admins can access all tables (implemented via service role in API routes)
-- These policies allow admin users to access all data
CREATE POLICY "Admins can manage profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = auth.uid() AND p.role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admins can manage transactions" ON transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = auth.uid() AND p.role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admins can manage KYC" ON kyc_submissions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = auth.uid() AND p.role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admins can manage support" ON support_tickets FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = auth.uid() AND p.role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admins can manage gateways" ON gateway_configs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = auth.uid() AND p.role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admins can manage wallet settings" ON wallet_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = auth.uid() AND p.role IN ('admin', 'super_admin'))
);
CREATE POLICY "Admins can manage country rates" ON country_rates FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = auth.uid() AND p.role IN ('admin', 'super_admin'))
);

-- ========== DEFAULT DATA ==========
-- Insert default country rates
INSERT INTO country_rates (country, country_code, currency, buy_rate, sell_rate, margin) VALUES
  ('Malawi', 'MW', 'MWK', 1750.00, 1820.00, 2.5),
  ('Kenya', 'KE', 'KES', 129.00, 134.00, 2.5),
  ('Nigeria', 'NG', 'NGN', 1485.00, 1535.00, 3.0),
  ('Ghana', 'GH', 'GHS', 12.50, 13.00, 2.5),
  ('Ethiopia', 'ET', 'ETB', 132.00, 137.00, 2.5),
  ('Mozambique', 'MZ', 'MZN', 63.00, 66.00, 2.5),
  ('Rwanda', 'RW', 'RWF', 1290.00, 1340.00, 2.5),
  ('Tanzania', 'TZ', 'TZS', 2540.00, 2640.00, 2.5),
  ('Uganda', 'UG', 'UGX', 3720.00, 3870.00, 2.5),
  ('Zambia', 'ZM', 'ZMW', 26.00, 27.00, 2.5),
  ('Zimbabwe', 'ZW', 'ZWL', 350.00, 370.00, 3.0);

-- Insert default wallet settings
INSERT INTO wallet_settings (setting_key, setting_value, description, category) VALUES
  ('min_deposit', '5', 'Minimum deposit amount in USDT', 'limits'),
  ('min_withdrawal', '5', 'Minimum withdrawal amount in USDT', 'limits'),
  ('max_daily_transfer', '10000', 'Maximum daily transfer limit in USDT', 'limits'),
  ('deposit_fee', '0', 'Fee for deposits (percentage)', 'fees'),
  ('withdrawal_fee', '1.5', 'Fee for withdrawals (percentage)', 'fees'),
  ('transfer_fee', '0.5', 'Fee for transfers (percentage)', 'fees'),
  ('referral_bonus', '2', 'Referral bonus amount in USDT', 'referral'),
  ('min_kyc_level', '1', 'Minimum KYC level required', 'kyc'),
  ('supported_networks', '["trc20","erc20","bsc","polygon"]', 'Supported USDT networks', 'network'),
  ('supported_countries', '["MW","KE","NG","GH","ET","MZ","RW","TZ","UG","ZM","ZW"]', 'Supported countries', 'general');

-- ========== TRIGGERS ==========
-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_virtual_cards_updated_at BEFORE UPDATE ON virtual_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kyc_submissions_updated_at BEFORE UPDATE ON kyc_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_country_rates_updated_at BEFORE UPDATE ON country_rates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gateway_configs_updated_at BEFORE UPDATE ON gateway_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallet_settings_updated_at BEFORE UPDATE ON wallet_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile and wallet on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  referral_code_value TEXT;
BEGIN
  -- Generate referral code
  referral_code_value := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
  
  -- Insert profile
  INSERT INTO profiles (user_id, email, full_name, referral_code)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), referral_code_value);
  
  -- Insert default wallet
  INSERT INTO wallets (user_id, balance, type, status, currency)
  VALUES (NEW.id, 0, 'usdt', 'active', 'USDT');
  
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
