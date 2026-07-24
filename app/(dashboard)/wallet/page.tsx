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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">My Wallet</h1>
        <p className="text-slate-500 mt-1">Your USDT balance and transaction history</p>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-brand-600 to-brand-900 text-white border-none shadow-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-brand-100 text-sm font-medium">Total Balance</p>
              <p className="text-4xl font-bold mt-1 font-display">
                {formatCurrency(balance, 'USDT')}
              </p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <Wallet className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-brand-100 text-xs">Available</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(available, 'USDT')}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-brand-100 text-xs">Locked</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(locked, 'USDT')}</p>
            </div>
          </div>
          {wallet?.wallet_address && (
            <div className="mt-4 bg-white/10 rounded-xl p-3">
              <p className="text-brand-100 text-xs">Wallet Address</p>
              <p className="font-mono text-sm mt-1 break-all">{wallet.wallet_address}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All your wallet transactions</CardDescription>
            </div>
            {transactions.length > 0 && <ExportButton transactions={transactions} />}
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Wallet className="h-10 w-10 text-slate-300" />}
              title="No transactions yet"
              description="Your transaction history will appear here once you start using your wallet."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
