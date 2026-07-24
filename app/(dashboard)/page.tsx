// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Banknote, 
  ShoppingBag, 
  Wallet as WalletIcon, 
  TrendingUp, 
  Clock,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { TransactionItem } from '@/components/ui/transaction-item';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { COUNTRIES, CountryRate, Profile, Transaction, Wallet } from '@/lib/types';
import { formatCurrency, shortAddress } from '@/lib/utils';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
  const profile = profileData as Profile;

  // Fetch wallet
  const { data: walletData } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .eq('type', 'usdt')
    .single();
  const wallet = walletData as Wallet;

  // Fetch recent transactions (last 10)
  const { data: transactionsData } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);
  const transactions = (transactionsData || []) as Transaction[];

  // Fetch country rate based on user country code
  const countryCode = profile?.country || 'MW'; // default fallback to MW (Malawi)
  const { data: rateData } = await supabase
    .from('country_rates')
    .select('*')
    .eq('country_code', countryCode)
    .single();
  
  // If rate doesn't exist, provide a fallback rate
  const countryInfo = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];
  const rate: CountryRate = (rateData as CountryRate) || {
    id: 'fallback',
    country: countryInfo.name,
    country_code: countryInfo.code,
    currency: countryInfo.currency,
    buy_rate: 1750.00,
    sell_rate: 1800.00,
    margin: 0.05,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Calculate stats
  const totalBalance = wallet ? Number(wallet.balance) : 0;
  const lockedBalance = wallet ? Number(wallet.locked_balance) : 0;
  const availableBalance = totalBalance - lockedBalance;

  // Calculate monthly volume (sum of completed transactions in the last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { data: monthlyTransactions } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .gte('created_at', thirtyDaysAgo.toISOString());
  
  const monthlyVolume = (monthlyTransactions || []).reduce(
    (acc, tx) => acc + Number(tx.amount),
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-display">
            Moni, {profile?.full_name?.split(' ')[0] || 'Friend'}! 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Welcome back to Nyasawallet. Manage your digital dollars securely.
          </p>
        </div>
        
        {wallet?.wallet_address && (
          <div className="flex items-center space-x-2 bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono">USDT Address: {shortAddress(wallet.wallet_address)}</span>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Balance"
          value={`$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<DollarSign className="h-5 w-5 text-brand-600" />}
          description="Total crypto equity in USDT"
          className="border-l-4 border-l-brand-600"
        />
        <StatCard
          title="Monthly Volume"
          value={`$${monthlyVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          description="Total completed volume (30d)"
          className="border-l-4 border-l-green-500"
        />
        <StatCard
          title="Available Balance"
          value={`$${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<WalletIcon className="h-5 w-5 text-amber-500" />}
          description="Unlocked & ready to transfer"
          className="border-l-4 border-l-amber-500"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Send, receive, buy or sell USDT in seconds</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/deposit">
            <Button className="w-full h-14 text-sm font-semibold flex items-center justify-center space-x-2" variant="outline">
              <ArrowDownLeft className="h-5 w-5 text-green-600" />
              <span>Deposit USDT</span>
            </Button>
          </Link>
          <Link href="/send">
            <Button className="w-full h-14 text-sm font-semibold flex items-center justify-center space-x-2" variant="outline">
              <ArrowUpRight className="h-5 w-5 text-red-600" />
              <span>Send USDT</span>
            </Button>
          </Link>
          <Link href="/sell">
            <Button className="w-full h-14 text-sm font-semibold flex items-center justify-center space-x-2" variant="outline">
              <Banknote className="h-5 w-5 text-amber-600" />
              <span>Sell USDT</span>
            </Button>
          </Link>
          <Link href="/sell">
            <Button className="w-full h-14 text-sm font-semibold flex items-center justify-center space-x-2 bg-brand-50 hover:bg-brand-100 text-brand-700 border-none">
              <ShoppingBag className="h-5 w-5" />
              <span>Buy USDT</span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Recent Transactions */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 font-display">Recent Transactions</h2>
            <Link href="/transactions">
              <Button variant="link" size="sm" className="font-semibold text-brand-600 hover:text-brand-700">
                View All <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                  <Clock className="h-10 w-10 text-slate-300 mb-3 animate-pulse" />
                  <p className="text-slate-500 font-semibold text-sm">No transactions yet</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Your transaction history will be displayed here once you perform active trades.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Exchange Rate Card */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 font-display">Local FX Rates</h2>
          <Card className="bg-gradient-to-br from-brand-900 via-brand-950 to-slate-900 text-white border-none shadow-xl">
            <CardHeader className="text-white pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-white font-semibold">
                  {rate.country} Rate
                </CardTitle>
                <Badge className="bg-brand-500/20 text-brand-200 hover:bg-brand-500/30 border border-brand-500/40">
                  {rate.currency}
                </Badge>
              </div>
              <CardDescription className="text-brand-200/70 text-xs">
                Guaranteed rates for instant payout
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-brand-900/40 p-3.5 rounded-xl border border-brand-800/50">
                  <p className="text-[10px] font-bold text-brand-300/80 uppercase tracking-wider">
                    We Buy USDT
                  </p>
                  <p className="text-xl font-black mt-1 font-display">
                    {formatCurrency(Number(rate.buy_rate), rate.currency)}
                  </p>
                  <p className="text-[10px] text-brand-200/50 mt-1">Per 1.00 USDT</p>
                </div>
                
                <div className="bg-brand-900/40 p-3.5 rounded-xl border border-brand-800/50">
                  <p className="text-[10px] font-bold text-brand-300/80 uppercase tracking-wider">
                    We Sell USDT
                  </p>
                  <p className="text-xl font-black mt-1 font-display">
                    {formatCurrency(Number(rate.sell_rate), rate.currency)}
                  </p>
                  <p className="text-[10px] text-brand-200/50 mt-1">Per 1.00 USDT</p>
                </div>
              </div>

              <div className="border-t border-brand-800/60 pt-4">
                <div className="flex justify-between items-center text-xs text-brand-200/70">
                  <span>Network Fees</span>
                  <span className="font-semibold text-green-400">0% Mobile Money</span>
                </div>
                <div className="flex justify-between items-center text-xs text-brand-200/70 mt-2">
                  <span>Margin rate</span>
                  <span>~{(Number(rate.margin) * 100).toFixed(1)}% included</span>
                </div>
              </div>

              <Link href="/sell" className="block">
                <Button className="w-full bg-brand-500 hover:bg-brand-600 text-white border-none text-xs font-bold tracking-wider uppercase h-11">
                  Exchange Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
