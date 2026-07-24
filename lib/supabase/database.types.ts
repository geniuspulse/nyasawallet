// Auto-generated Supabase database types
// This is a simplified version — run `supabase gen types` to generate full types

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
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
          role: 'user' | 'admin' | 'super_admin';
          status: string;
          kyc_status: 'unverified' | 'pending' | 'approved' | 'rejected';
          referral_code: string | null;
          referred_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          full_name?: string | null;
          phone_number?: string | null;
          country?: string | null;
          city?: string | null;
          address?: string | null;
          date_of_birth?: string | null;
          id_number?: string | null;
          id_type?: string | null;
          role?: 'user' | 'admin' | 'super_admin';
          status?: string;
          kyc_status?: 'unverified' | 'pending' | 'approved' | 'rejected';
          referral_code?: string | null;
          referred_by?: string | null;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          balance: number;
          type: 'usdt' | 'local' | 'savings';
          status: 'active' | 'frozen' | 'closed';
          wallet_address: string | null;
          currency: string;
          locked_balance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          balance?: number;
          type?: 'usdt' | 'local' | 'savings';
          status?: 'active' | 'frozen' | 'closed';
          wallet_address?: string | null;
          currency?: string;
          locked_balance?: number;
        };
        Update: Partial<Database['public']['Tables']['wallets']['Insert']>;
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          wallet_id: string | null;
          type: string;
          status: string;
          method: string | null;
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
        };
        Insert: {
          id?: string;
          user_id: string;
          wallet_id?: string | null;
          type: string;
          status?: string;
          method?: string | null;
          amount: number;
          fee?: number;
          currency?: string;
          local_amount?: number | null;
          local_currency?: string | null;
          exchange_rate?: number | null;
          country?: string | null;
          phone_number?: string | null;
          account_name?: string | null;
          account_number?: string | null;
          bank_name?: string | null;
          wallet_address?: string | null;
          network?: string | null;
          tx_hash?: string | null;
          reference?: string | null;
          recipient_email?: string | null;
          sender_email?: string | null;
          payment_provider?: string | null;
          metadata?: Record<string, unknown>;
        };
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>;
      };
      country_rates: {
        Row: {
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
        };
        Insert: Partial<Database['public']['Tables']['country_rates']['Row']> & {
          country: string;
          country_code: string;
          currency: string;
          buy_rate: number;
          sell_rate: number;
        };
        Update: Partial<Database['public']['Tables']['country_rates']['Insert']>;
      };
      gateway_configs: {
        Row: {
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
        };
        Insert: Partial<Database['public']['Tables']['gateway_configs']['Row']> & {
          provider_name: string;
        };
        Update: Partial<Database['public']['Tables']['gateway_configs']['Insert']>;
      };
      virtual_cards: {
        Row: {
          id: string;
          user_id: string;
          card_number: string | null;
          card_holder: string | null;
          expiry_month: string | null;
          expiry_year: string | null;
          cvv: string | null;
          balance: number;
          type: 'virtual' | 'physical';
          status: 'active' | 'frozen' | 'closed' | 'pending';
          spending_limit: number | null;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['virtual_cards']['Row']> & {
          user_id: string;
        };
        Update: Partial<Database['public']['Tables']['virtual_cards']['Insert']>;
      };
      kyc_submissions: {
        Row: {
          id: string;
          user_id: string;
          document_type: string | null;
          document_number: string | null;
          document_front_url: string | null;
          document_back_url: string | null;
          selfie_url: string | null;
          proof_of_address_url: string | null;
          country: string | null;
          status: string;
          rejection_reason: string | null;
          reviewed_by: string | null;
          submitted_at: string;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['kyc_submissions']['Row']> & {
          user_id: string;
        };
        Update: Partial<Database['public']['Tables']['kyc_submissions']['Insert']>;
      };
      support_tickets: {
        Row: {
          id: string;
          user_id: string;
          subject: string;
          description: string | null;
          category: string | null;
          priority: string;
          status: string;
          assigned_to: string | null;
          ai_handled: boolean;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['support_tickets']['Row']> & {
          user_id: string;
          subject: string;
        };
        Update: Partial<Database['public']['Tables']['support_tickets']['Insert']>;
      };
      support_messages: {
        Row: {
          id: string;
          ticket_id: string;
          user_id: string | null;
          message: string;
          is_from_user: boolean;
          is_ai: boolean;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['support_messages']['Row']> & {
          ticket_id: string;
          message: string;
        };
        Update: Partial<Database['public']['Tables']['support_messages']['Insert']>;
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referred_id: string | null;
          referral_code: string;
          status: string;
          bonus: number;
          rewarded_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['referrals']['Row']> & {
          referrer_id: string;
          referral_code: string;
        };
        Update: Partial<Database['public']['Tables']['referrals']['Insert']>;
      };
      wallet_settings: {
        Row: {
          id: string;
          setting_key: string;
          setting_value: string | null;
          description: string | null;
          category: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['wallet_settings']['Row']> & {
          setting_key: string;
        };
        Update: Partial<Database['public']['Tables']['wallet_settings']['Insert']>;
      };
      balance_snapshots: {
        Row: {
          id: string;
          user_id: string;
          wallet_id: string;
          balance: number;
          currency: string | null;
          snapshot_type: string;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['balance_snapshots']['Row']> & {
          user_id: string;
          wallet_id: string;
          balance: number;
        };
        Update: Partial<Database['public']['Tables']['balance_snapshots']['Insert']>;
      };
    };
  };
};
