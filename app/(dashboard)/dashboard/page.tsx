// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Wallet, ArrowDownLeft, ArrowUpRight, Coins, CreditCard, History, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { PageHeader } from '@/components/ui/page-header';
import type { Profile, Wallet as WalletType } from '@/lib/types';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  // Fetch profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const profile = profileData as Profile | null;
  if (!profile?.full_name) redirect('/onboarding');

  // Fetch wallet
  const { data: walletData } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', 'usdt')
    .single();

  const wallet = walletData as WalletType | null;
  const balance = wallet ? Number(wallet.balance) : 0;

  // Fetch recent transactions
  const { data: recentTxns } = await supabase
    .from('transactions')
    .select('*')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_date', { ascending: false })
    .limit(5);

  const firstName = profile.full_name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Welcome back, ${firstName} 👋`}
        subtitle="Here's your wallet overview"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Wallet Balance"
          value={`${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          icon={<Wallet className="h-5 w-5" />}
        />
        <StatCard
          label="Total Sent"
          value="0.00"
          icon={<ArrowUpRight className="h-5 w-5" />}
        />
        <StatCard
          label="Total Received"
          value="0.00"
          icon={<ArrowDownLeft className="h-5 w-5" />}
        />
        <StatCard
          label="Transactions"
          value={recentTxns?.length || 0}
          icon={<History className="h-5 w-5" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/deposit"
          className="card-hover group flex flex-col items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card hover:shadow-card-hover"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:scale-110 transition-transform">
            <ArrowDownLeft className="h-6 w-6" />
          </div>
          <span className="text-sm font-semibold text-slate-700">Deposit</span>
        </Link>
        <Link
          href="/send"
          className="card-hover group flex flex-col items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card hover:shadow-card-hover"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="h-6 w-6" />
          </div>
          <span className="text-sm font-semibold text-slate-700">Send</span>
        </Link>
        <Link
          href="/sell"
          className="card-hover group flex flex-col items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card hover:shadow-card-hover"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:scale-110 transition-transform">
            <Coins className="h-6 w-6" />
          </div>
          <span className="text-sm font-semibold text-slate-700">Sell USDT</span>
        </Link>
        <Link
          href="/card"
          className="card-hover group flex flex-col items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card hover:shadow-card-hover"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:scale-110 transition-transform">
            <CreditCard className="h-6 w-6" />
          </div>
          <span className="text-sm font-semibold text-slate-700">Virtual Card</span>
        </Link>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-card">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-display text-lg font-bold text-slate-900">Recent Activity</h3>
          <Link
            href="/transactions"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            View all
          </Link>
        </div>
        <div className="p-5">
          {recentTxns && recentTxns.length > 0 ? (
            <div className="space-y-3">
              {recentTxns.map((txn: any) => (
                <div key={txn.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${txn.type === 'send' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {txn.type === 'send' ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{txn.type === 'send' ? 'Sent' : 'Received'}</p>
                      <p className="text-xs text-slate-400">{new Date(txn.created_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${txn.type === 'send' ? 'text-red-600' : 'text-green-600'}`}>
                    {txn.type === 'send' ? '-' : '+'}{Number(txn.amount || 0).toFixed(2)} USDT
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 mb-4">
                <History className="h-8 w-8" />
              </div>
              <p className="text-sm font-medium text-slate-500">No transactions yet</p>
              <p className="text-xs text-slate-400 mt-1">Start by depositing or sending USDT</p>
              <Link
                href="/deposit"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
              >
                <ArrowDownLeft className="h-4 w-4" />
                Make your first deposit
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
