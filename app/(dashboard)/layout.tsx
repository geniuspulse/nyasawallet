// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/ui/sidebar';
import { BottomNav } from '@/components/ui/bottom-nav';
import type { Profile, Wallet } from '@/lib/types';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch Profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const profile = profileData as Profile | null;

  // Redirect to onboarding if profile is incomplete (no full_name)
  if (!profile || !profile.full_name) {
    redirect('/onboarding');
  }

  // Fetch Wallet (default to 'usdt')
  let { data: walletData } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', 'usdt')
    .single();

  // If no wallet exists, create one
  if (!walletData) {
    const { data: newWallet, error: createError } = await supabase
      .from('wallets')
      .insert({
        user_id: user.id,
        balance: 1000.0,
        type: 'usdt',
        status: 'active',
        wallet_address: `0x${Math.random().toString(16).substring(2, 42)}`,
        currency: 'USDT',
        locked_balance: 0,
      })
      .select('*')
      .single();

    if (!createError && newWallet) {
      walletData = newWallet;
    }
  }

  const wallet = walletData as Wallet | null;
  const balance = wallet ? Number(wallet.balance) : 0;

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar Navigation (desktop) */}
      <Sidebar
        userEmail={user.email || ''}
        fullName={profile.full_name || ''}
        walletBalance={balance}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 px-4 py-4 md:px-8 md:py-6 pb-24 md:pb-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Bottom Navigation (mobile) */}
      <BottomNav />
    </div>
  );
}
