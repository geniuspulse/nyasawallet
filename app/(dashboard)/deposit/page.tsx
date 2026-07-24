// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { Loading } from '@/components/ui/loading';
import { USDT_NETWORKS, Wallet } from '@/lib/types';
import { Copy, Check, ArrowRight, ExternalLink, AlertCircle, Wallet as WalletIcon, Coins } from 'lucide-react';

const MOCK_NETWORKS_ADDRESSES: Record<string, string> = {
  trc20: 'TYpwC79W3uJshv6hG68n4D8J7u5oXhBv6e',
  erc20: '0x71C21A407B65d1d642f4949D634eF56708518eA9',
  bsc: '0x71C21A407B65d1d642f4949D634eF56708518eA9',
  polygon: '0x71C21A407B65d1d642f4949D634eF56708518eA9',
};

export default function DepositPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [network, setNetwork] = useState<string>('trc20');
  const [amount, setAmount] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          const { data: walletData } = await supabase
            .from('wallets')
            .select('*')
            .eq('user_id', user.id)
            .eq('type', 'usdt')
            .single();
          
          if (walletData) {
            setWallet(walletData as Wallet);
          }
        }
      } catch (err) {
        console.error('Error fetching wallet:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedNetwork = USDT_NETWORKS.find((n) => n.id === network) || USDT_NETWORKS[0];
  const depositAddress = wallet?.wallet_address || MOCK_NETWORKS_ADDRESSES[network] || MOCK_NETWORKS_ADDRESSES.trc20;

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid deposit amount');
      return;
    }
    if (!userId) {
      setError('User session not found');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const parsedAmount = parseFloat(amount);
      const reference = `DEP-${Math.floor(100000 + Math.random() * 900000)}`;

      const { error: txError } = await supabase.from('transactions').insert({
        user_id: userId,
        wallet_id: wallet?.id || null,
        type: 'deposit',
        status: 'pending',
        method: 'usdt',
        amount: parsedAmount,
        fee: selectedNetwork.fee,
        currency: 'USDT',
        wallet_address: depositAddress,
        network: selectedNetwork.name,
        reference: reference,
        metadata: {
          confirmations_required: selectedNetwork.confirmations,
          network_id: selectedNetwork.id,
        },
      });

      if (txError) throw txError;

      setIsSuccess(true);
      setAmount('');
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating deposit transaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading deposit details..." fullPage />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Deposit USDT"
        subtitle="Fund your Nyasawallet securely with USDT on your preferred network."
      />

      {isSuccess ? (
        <Card className="border-green-200 bg-green-50/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
              <Check className="h-6 w-6 stroke-[3]" />
            </div>
            <CardTitle className="text-xl text-green-900 font-extrabold font-space">Deposit Initiated!</CardTitle>
            <CardDescription className="text-green-700 font-medium">
              We are waiting for your deposit on the blockchain network.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <p className="text-center font-semibold text-slate-700">
              Please ensure you have sent the exact amount to the deposit address shown.
            </p>
            <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-3 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-400">Network:</span>
                <span className="font-bold text-slate-800">{selectedNetwork.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient Address:</span>
                <span className="font-mono text-xs font-bold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                  {depositAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Required Confirmations:</span>
                <span className="font-bold text-slate-800">{selectedNetwork.confirmations}</span>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => setIsSuccess(false)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl"
              >
                Make Another Deposit
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/transactions'}
                className="flex-1 border-slate-200 hover:bg-slate-50 font-bold h-11 rounded-xl"
              >
                View History
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg border-slate-200 overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg font-bold text-slate-800">Deposit USDT (Stablecoin)</CardTitle>
            <CardDescription>
              Select your network, transfer your tokens, and confirm.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Network Selector */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                  1. Select Blockchain Network
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {USDT_NETWORKS.map((net) => {
                    const isSelected = network === net.id;
                    return (
                      <button
                        type="button"
                        key={net.id}
                        onClick={() => setNetwork(net.id)}
                        className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/30 text-indigo-950 shadow-md shadow-indigo-600/5 ring-1 ring-indigo-600'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <span className="text-sm font-bold block">{net.name}</span>
                        <span className="text-[10px] text-slate-400 mt-1 font-semibold">
                          Fee: ${net.fee} • Conf: {net.confirmations}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" />
                  Sending USDT on a different network than selected may result in permanent loss of funds.
                </div>
              </div>

              {/* Deposit Address Box */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                  2. Copy Deposit Address
                </label>
                <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between gap-4 border border-slate-800">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Coins className="h-4 w-4 text-indigo-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-space">
                        Your {selectedNetwork.name} Wallet
                      </span>
                    </div>
                    <p className="font-mono text-sm font-semibold select-all break-all tracking-tight leading-relaxed text-indigo-100">
                      {depositAddress}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all duration-200 flex items-center justify-center shrink-0 border border-slate-700 shadow-sm"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-400 stroke-[3]" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block" htmlFor="amount">
                  3. Enter Deposit Amount (USDT)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-display">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8 rounded-xl font-bold border-slate-200 focus-visible:ring-indigo-600 text-slate-800 h-11"
                    required
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                  <span>Network Transfer Fee: ${selectedNetwork.fee}</span>
                  <span>Min Deposit: 1.00 USDT</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2 border border-red-100">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10"
              >
                {isSubmitting ? 'Verifying...' : "I've Made the Deposit"}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
