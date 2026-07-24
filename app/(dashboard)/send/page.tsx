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
import { formatCurrency } from '@/lib/utils';
import { ArrowRight, AlertCircle, Check, ShieldAlert, Mail, CreditCard, Send } from 'lucide-react';

export default function SendPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [recipient, setRecipient] = useState('');
  const [network, setNetwork] = useState('trc20');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWallet() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
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
    loadWallet();
  }, []);

  const selectedNetwork = USDT_NETWORKS.find((n) => n.id === network) || USDT_NETWORKS[0];
  const balance = wallet ? Number(wallet.balance) : 0;
  const lockedBalance = wallet ? Number(wallet.locked_balance) : 0;
  const availableBalance = balance - lockedBalance;

  const handleAmountChange = (val: string) => {
    setAmount(val);
  };

  const handleMaxClick = () => {
    const maxAmount = Math.max(0, availableBalance - selectedNetwork.fee);
    setAmount(maxAmount.toFixed(2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!recipient.trim()) {
      setError('Recipient email or wallet address is required.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    const totalCost = parsedAmount + selectedNetwork.fee;
    if (totalCost > availableBalance) {
      setError(`Insufficient balance. You need $${totalCost.toFixed(2)} ($${parsedAmount.toFixed(2)} + $${selectedNetwork.fee.toFixed(2)} fee) but only have $${availableBalance.toFixed(2)} available.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'send',
          recipient: recipient.trim(),
          amount: parsedAmount,
          network: selectedNetwork.name,
          fee: selectedNetwork.fee,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send transaction.');
      }

      // Success! Refresh balance
      setIsSuccess(true);
      setWallet(prev => prev ? { ...prev, balance: prev.balance - totalCost } : null);
      setRecipient('');
      setAmount('');
    } catch (err: any) {
      setError(err.message || 'An error occurred during transaction processing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading send options..." fullPage />;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Send USDT"
        subtitle="Transfer USDT instantly to another Nyasawallet email, or external blockchain address."
      />

      {isSuccess ? (
        <Card className="border-green-200 bg-green-50/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
              <Check className="h-6 w-6 stroke-[3]" />
            </div>
            <CardTitle className="text-xl text-green-900 font-extrabold font-space">Transfer Sent!</CardTitle>
            <CardDescription className="text-green-700 font-medium">
              Your USDT transfer has been completed successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <p className="text-center font-semibold text-slate-700">
              The recipient will receive their funds shortly.
            </p>
            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => setIsSuccess(false)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl"
              >
                Send More USDT
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
            <CardTitle className="text-lg font-bold text-slate-800">Send Transfer</CardTitle>
            <CardDescription>
              Transfer digital stablecoins instantly. Available: {formatCurrency(availableBalance, 'USDT')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Recipient */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block" htmlFor="recipient">
                  Recipient Email or Wallet Address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail className="h-5 w-5" />
                  </span>
                  <Input
                    id="recipient"
                    type="text"
                    placeholder="Enter email address or crypto address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="pl-11 rounded-xl border-slate-200 focus-visible:ring-indigo-600 text-slate-800 h-11"
                    required
                  />
                </div>
                <span className="text-[11px] text-slate-400 font-semibold block">
                  Tip: Internal transfers using a registered Nyasawallet email are instant and gasless.
                </span>
              </div>

              {/* Network Selector */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                  Blockchain Network
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
                          Fee: ${net.fee}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider" htmlFor="amount">
                    Transfer Amount (USDT)
                  </label>
                  <button
                    type="button"
                    onClick={handleMaxClick}
                    className="text-xs text-indigo-600 font-bold hover:text-indigo-700 hover:underline"
                  >
                    Send Max
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-display">$</span>
                  <Input
                    id="amount"
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="pl-8 pr-16 rounded-xl font-bold border-slate-200 focus-visible:ring-indigo-600 text-slate-800 h-11"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    USDT
                  </span>
                </div>
              </div>

              {/* Fee Summary */}
              {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 font-medium text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Sending:</span>
                    <span className="font-bold text-slate-800">${parseFloat(amount).toFixed(2)} USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network Gas Fee:</span>
                    <span className="font-bold text-slate-800">${selectedNetwork.fee.toFixed(2)} USDT</span>
                  </div>
                  <div className="border-t border-slate-200/60 pt-2.5 flex justify-between text-sm font-bold text-slate-900">
                    <span>Total Deduction:</span>
                    <span>${(parseFloat(amount) + selectedNetwork.fee).toFixed(2)} USDT</span>
                  </div>
                </div>
              )}

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
                {isSubmitting ? 'Processing...' : 'Send USDT Now'}
                {!isSubmitting && <Send className="h-4 w-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
