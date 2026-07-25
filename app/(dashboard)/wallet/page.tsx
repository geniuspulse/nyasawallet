// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TransactionItem } from '@/components/ui/transaction-item';
import { EmptyState } from '@/components/ui/empty-state';
import { Wallet } from 'lucide-react';
import ExportButton from './ExportButton';
import { Profile, Transaction, Wallet as WalletType } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export const metadata = { title: 'Wallet' };

export default async function WalletPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  // Redirect to onboarding if not yet completed
  const { data: profileCheck } = await supabase
    .from('profiles')
    .select('is_onboarded, full_name')
    .eq('user_id', user.id)
    .single();
  if (!(profileCheck as any)?.is_onboarded) redirect('/onboarding');

  const { data: walletData } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', 'usdt')
    .single();
  const wallet = walletData as WalletType;

  const { data: transactionsData } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);
  const transactions = (transactionsData || []) as Transaction[];

  const balance = wallet ? Number(wallet.balance) : 0;
  const locked = wallet ? Number(wallet.locked_balance || 0) : 0;
  const available = balance - locked;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="pb-2">
        <h1 className="section-heading text-xl sm:text-2xl">My Wallet</h1>
        <p className="text-sm text-slate-500 mt-0.5">Your USDT balance and transaction history</p>
      </div>

      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white shadow-lg">
        {/* Decorative glow */}
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-brand-400/10 blur-xl" />
        
        <div className="relative p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-brand-100 text-sm font-medium">Total Balance</p>
              <p className="text-3xl font-bold mt-1 font-display tracking-tight">
                {formatCurrency(balance, 'USDT')}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <Wallet className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/5">
              <p className="text-brand-100 text-xs">Available</p>
              <p className="text-lg font-bold mt-0.5">{formatCurrency(available, 'USDT')}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/5">
              <p className="text-brand-100 text-xs">Locked</p>
              <p className="text-lg font-bold mt-0.5">{formatCurrency(locked, 'USDT')}</p>
            </div>
          </div>
          {wallet?.wallet_address && (
            <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/5">
              <p className="text-brand-100 text-xs">Wallet Address</p>
              <p className="font-mono text-xs mt-0.5 break-all opacity-90">{wallet.wallet_address}</p>
            </div>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div>
            <h3 className="section-heading text-base">Transaction History</h3>
            <p className="text-xs text-slate-500 mt-0.5">All your wallet transactions</p>
          </div>
          {transactions.length > 0 && <ExportButton transactions={transactions} />}
        </div>
        <div className="p-4">
          {transactions.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {transactions.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Wallet className="h-8 w-8 text-slate-300" />}
              title="No transactions yet"
              description="Your transaction history will appear here once you start using your wallet."
            />
          )}
        </div>
      </div>
    </div>
  );
}
