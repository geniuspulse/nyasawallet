// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { OverviewCharts } from '@/components/admin/overview-charts';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import {
  Users,
  ShieldCheck,
  LifeBuoy,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  // Safe wrapper for Supabase calls to ensure the dashboard never crashes
  const fetchDashboardData = async () => {
    try {
      // 1. Total Users
      const { count: totalUsers, error: usersErr } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // 2. Pending KYC
      const { count: pendingKyc, error: kycErr } = await supabase
        .from('kyc_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // 3. Open Tickets
      const { count: openTickets, error: ticketsErr } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

      // 4. Active Wallets
      const { count: activeWallets, error: walletsErr } = await supabase
        .from('wallets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // 5. Total USDT in System
      const { data: walletSums, error: balanceErr } = await supabase
        .from('wallets')
        .select('balance');
      const totalUsdt = walletSums?.reduce((sum, w) => sum + (w.balance || 0), 0) || 0;

      // 6. Total Volume
      const { data: txSums, error: txErr } = await supabase
        .from('transactions')
        .select('amount')
        .in('status', ['completed', 'approved']);
      const totalVolume = txSums?.reduce((sum, tx) => sum + (tx.amount || 0), 0) || 0;

      // 7. Recent Activity Feed (with profiles joined)
      const { data: recentTransactions, error: feedErr } = await supabase
        .from('transactions')
        .select('*, profiles!transactions_user_id_fkey(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(5);

      // Handle cases where the foreign key join names vary (or fallback)
      let resolvedTransactions = recentTransactions || [];
      if (feedErr && !recentTransactions) {
        // Fallback: fetch without profiles join, then map or just show standard fields
        const { data: rawTxs } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        resolvedTransactions = rawTxs || [];
      }

      return {
        totalUsers: totalUsers || 0,
        pendingKyc: pendingKyc || 0,
        openTickets: openTickets || 0,
        activeWallets: activeWallets || 0,
        totalUsdt,
        totalVolume,
        recentTransactions: resolvedTransactions,
      };
    } catch (e) {
      console.error('Error fetching dashboard stats:', e);
      return {
        totalUsers: 0,
        pendingKyc: 0,
        openTickets: 0,
        activeWallets: 0,
        totalUsdt: 0,
        totalVolume: 0,
        recentTransactions: [],
      };
    }
  };

  const data = await fetchDashboardData();

  const statCards = [
    {
      title: 'Total Users',
      value: data.totalUsers.toLocaleString(),
      description: 'Registered profiles',
      icon: Users,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400',
    },
    {
      title: 'Total Volume',
      value: formatCurrency(data.totalVolume, 'USDT'),
      description: 'Completed operations',
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400',
    },
    {
      title: 'Pending KYC',
      value: data.pendingKyc.toString(),
      description: 'Awaiting review',
      icon: ShieldCheck,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400',
    },
    {
      title: 'Open Tickets',
      value: data.openTickets.toString(),
      description: 'Unresolved support',
      icon: LifeBuoy,
      color: 'text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400',
    },
    {
      title: 'Active Wallets',
      value: data.activeWallets.toLocaleString(),
      description: 'Funded / Active systems',
      icon: Wallet,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/20 dark:text-purple-400',
    },
    {
      title: 'Total USDT in System',
      value: formatCurrency(data.totalUsdt, 'USDT'),
      description: 'Aggregated user balances',
      icon: Activity,
      color: 'text-brand-600 bg-brand-50 dark:bg-brand-950/20 dark:text-indigo-400',
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Overview"
        subtitle="Comprehensive stats, volume figures, and administrative tasks for Nyasawallet."
      />

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      {card.title}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-2">
                      {card.value}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">
                      {card.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${card.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <OverviewCharts />

      {/* Bottom Section: Recent Activity / Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Transactions Feed */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-md font-semibold text-gray-900 dark:text-gray-50">
              Recent Transactions
            </h3>
            <Link
              href="/admin/transactions"
              className="text-xs font-semibold text-brand-600 hover:text-brand-500 dark:text-indigo-400"
            >
              View all
            </Link>
          </div>

          {data.recentTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Activity className="h-8 w-8 text-gray-400 mb-2 animate-pulse" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No recent transactions found.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {data.recentTransactions.map((tx: any) => {
                const isIncoming = tx.type === 'deposit' || tx.type === 'referral_bonus';
                return (
                  <div key={tx.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${isIncoming ? 'bg-green-50 text-green-600 dark:bg-green-950/20' : 'bg-red-50 text-red-600 dark:bg-red-950/20'}`}>
                        {isIncoming ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">
                          {tx.type.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {tx.profiles?.full_name || tx.sender_email || tx.recipient_email || 'System user'} • {formatDate(tx.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {isIncoming ? '+' : '-'}{formatCurrency(tx.amount, tx.currency || 'USDT')}
                      </p>
                      <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Admin Quick Actions */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <h3 className="text-md font-semibold text-gray-900 dark:text-gray-50 mb-6">
            Quick Administration
          </h3>
          <div className="space-y-4">
            <Link
              href="/admin/kyc"
              className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">KYC Review Queue</p>
                <p className="text-xs text-gray-400 mt-0.5">Manage user verifications</p>
              </div>
              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                {data.pendingKyc}
              </span>
            </Link>

            <Link
              href="/admin/support"
              className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Support Tickets</p>
                <p className="text-xs text-gray-400 mt-0.5">Reply to support requests</p>
              </div>
              <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                {data.openTickets}
              </span>
            </Link>

            <Link
              href="/admin/rates"
              className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Update FX Rates</p>
                <p className="text-xs text-gray-400 mt-0.5">Manage country currency spreads</p>
              </div>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
