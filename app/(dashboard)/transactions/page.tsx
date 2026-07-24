// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Transaction, TransactionType } from '@/lib/types';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight, Ban, Clock, Filter, FileText } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const resolvedParams = await searchParams;
  const currentFilter = resolvedParams.type || 'all';

  // Fetch all transactions for this user
  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (currentFilter !== 'all') {
    query = query.eq('type', currentFilter);
  }

  const { data: transactionsData, error } = await query;
  const transactions = (transactionsData || []) as Transaction[];

  const filterButtons = [
    { label: 'All', value: 'all' },
    { label: 'Deposit', value: 'deposit' },
    { label: 'Send', value: 'send' },
    { label: 'Sell', value: 'sell' },
    { label: 'Buy', value: 'buy' },
  ];

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'success';
      case 'send':
        return 'destructive';
      case 'sell':
        return 'warning';
      case 'buy':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Transactions"
        subtitle="Keep track of your digital deposits, transfers, and exchanges."
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5" /> Filter by:
        </span>
        {filterButtons.map((btn) => {
          const isActive = currentFilter === btn.value;
          return (
            <Link
              key={btn.value}
              href={btn.value === 'all' ? '/transactions' : `/transactions?type=${btn.value}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
                isActive
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-600/10'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {btn.label}
            </Link>
          );
        })}
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Transactions Found"
          description={
            currentFilter === 'all'
              ? "You haven't made any transactions yet. Start by depositing USDT to your wallet."
              : `You don't have any ${currentFilter} transactions in your history.`
          }
          action={
            currentFilter === 'all' ? (
              <Link href="/deposit" className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-brand-500 transition-colors">
                Deposit USDT
              </Link>
            ) : undefined
          }
        />
      ) : (
        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-base text-slate-800 font-bold">Transaction History</CardTitle>
            <CardDescription>
              Showing {transactions.length} {currentFilter !== 'all' ? currentFilter : ''} transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/30 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Type</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Fee</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-600">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-500 text-xs">
                        {formatDate(tx.created_at)}
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={getTypeBadgeVariant(tx.type)} className="capitalize font-bold text-[10px]">
                          {tx.type}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 font-display font-bold text-slate-800">
                        {tx.type === 'deposit' || tx.type === 'buy' || tx.type === 'referral_bonus' ? '+' : '-'} {formatCurrency(Number(tx.amount), tx.currency)}
                        {tx.local_amount && tx.local_currency && (
                          <span className="block text-xs font-semibold text-slate-400 mt-0.5">
                            ≈ {formatCurrency(Number(tx.local_amount), tx.local_currency)}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-400 text-xs font-semibold">
                        {tx.fee && Number(tx.fee) > 0 ? formatCurrency(Number(tx.fee), tx.currency) : 'Free'}
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={getStatusBadgeVariant(tx.status)} className="capitalize font-bold text-[10px]">
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-xs font-bold text-slate-500 capitalize">
                        {tx.method ? tx.method.replace('_', ' ') : 'USDT'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
