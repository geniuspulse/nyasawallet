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
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      <PageHeader
        title={`Welcome, ${firstName} 👋`}
        subtitle="Your wallet overview"
      />

      {/* Stats Grid - 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <StatCard
          label="Balance"
          value={`${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatCard
          label="Sent"
          value="0.00"
          icon={<ArrowUpRight className="h-4 w-4" />}
        />
        <StatCard
          label="Received"
          value="0.00"
          icon={<ArrowDownLeft className="h-4 w-4" />}
        />
        <StatCard
          label="Txns"
          value={recentTxns?.length || 0}
          icon={<History className="h-4 w-4" />}
        />
      </div>

      {/* Quick Actions - 4 cols always, tighter on mobile */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        <Link
          href="/deposit"
          className="card-hover group flex flex-col items-center gap-2 rounded-xl border border-slate-200/60 bg-white p-3 sm:p-4 shadow-sm hover:shadow-md active:scale-95"
        >
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600 group-hover:scale-110 transition-transform">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold text-slate-700">Deposit</span>
        </Link>
        <Link
          href="/send"
          className="card-hover group flex flex-col items-center gap-2 rounded-xl border border-slate-200/60 bg-white p-3 sm:p-4 shadow-sm hover:shadow-md active:scale-95"
        >
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold text-slate-700">Send</span>
        </Link>
        <Link
          href="/sell"
          className="card-hover group flex flex-col items-center gap-2 rounded-xl border border-slate-200/60 bg-white p-3 sm:p-4 shadow-sm hover:shadow-md active:scale-95"
        >
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600 group-hover:scale-110 transition-transform">
            <Coins className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold text-slate-700">Sell</span>
        </Link>
        <Link
          href="/card"
          className="card-hover group flex flex-col items-center gap-2 rounded-xl border border-slate-200/60 bg-white p-3 sm:p-4 shadow-sm hover:shadow-md active:scale-95"
        >
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600 group-hover:scale-110 transition-transform">
            <CreditCard className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold text-slate-700">Card</span>
        </Link>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-100">
          <h3 className="section-heading text-base">Recent Activity</h3>
          <Link
            href="/transactions"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            View all
          </Link>
        </div>
        <div className="px-4 sm:px-5 py-2">
          {recentTxns && recentTxns.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {recentTxns.map((txn: any) => (
                <div key={txn.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${txn.type === 'send' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {txn.type === 'send' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{txn.type === 'send' ? 'Sent' : 'Received'}</p>
                      <p className="text-xs text-slate-400">{new Date(txn.created_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold whitespace-nowrap ${txn.type === 'send' ? 'text-red-600' : 'text-green-600'}`}>
                    {txn.type === 'send' ? '-' : '+'}{Number(txn.amount || 0).toFixed(2)} USDT
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-300 mb-2.5">
                <History className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-slate-500">No transactions yet</p>
              <p className="text-xs text-slate-400 mt-0.5">Start by depositing or sending USDT</p>
              <Link
                href="/deposit"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors active:scale-95"
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
