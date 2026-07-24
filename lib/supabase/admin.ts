// @ts-nocheck
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Admin client with service role key — use ONLY in server-side API routes
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
