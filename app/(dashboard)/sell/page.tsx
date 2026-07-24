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
import { COUNTRIES, CountryRate, Wallet } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { AlertCircle, Check, Coins, ArrowRight, Wallet as WalletIcon, Smartphone, Building, RefreshCw } from 'lucide-react';

export default function SellPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [rates, setRates] = useState<CountryRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<CountryRate | null>(null);

  // Form states
  const [payoutMethod, setPayoutMethod] = useState<'mobile_money' | 'bank_transfer'>('mobile_money');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Fetch wallet
          const { data: walletData } = await supabase
            .from('wallets')
            .select('*')
            .eq('user_id', user.id)
            .eq('type', 'usdt')
            .single();
          
          if (walletData) {
            setWallet(walletData as Wallet);
          }

          // Fetch profile for default country rate
          const { data: profileData } = await supabase
            .from('profiles')
            .select('country')
            .eq('user_id', user.id)
            .single();

          // Fetch active rates
          const { data: ratesData } = await supabase
            .from('country_rates')
            .select('*')
            .eq('is_active', true);

          const fetchedRates = (ratesData || []) as CountryRate[];
          setRates(fetchedRates);

          if (fetchedRates.length > 0) {
            const userCountry = profileData?.country || 'MW';
            const defaultRate = fetchedRates.find((r) => r.country_code === userCountry) || fetchedRates[0];
            setSelectedRate(defaultRate);

            // Set default mobile money provider if any
            const countryMeta = COUNTRIES.find((c) => c.code === defaultRate.country_code);
            if (countryMeta && countryMeta.mobileMoney && countryMeta.mobileMoney.length > 0) {
              setProvider(countryMeta.mobileMoney[0]);
            }
          }
        }
      } catch (err) {
        console.error('Error loading sell data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const balance = wallet ? Number(wallet.balance) : 0;
  const lockedBalance = wallet ? Number(wallet.locked_balance) : 0;
  const availableBalance = balance - lockedBalance;

  const handleRateChange = (rateId: string) => {
    const rate = rates.find((r) => r.id === rateId) || null;
    setSelectedRate(rate);

    if (rate) {
      const countryMeta = COUNTRIES.find((c) => c.code === rate.country_code);
      if (countryMeta && countryMeta.mobileMoney && countryMeta.mobileMoney.length > 0) {
        setProvider(countryMeta.mobileMoney[0]);
      } else {
        setProvider('');
      }
    }
  };

  const usdtAmount = parseFloat(amount) || 0;
  const localPayout = selectedRate ? usdtAmount * Number(selectedRate.buy_rate) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedRate) {
      setError('Please select a country/fiat currency.');
      return;
    }

    if (usdtAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    if (usdtAmount > availableBalance) {
      setError(`Insufficient balance. You only have $${availableBalance.toFixed(2)} USDT available.`);
      return;
    }

    if (payoutMethod === 'mobile_money') {
      if (!phoneNumber.trim()) {
        setError('Phone number is required for mobile money payout.');
        return;
      }
      if (!provider) {
        setError('Please select a mobile money provider.');
        return;
      }
    } else {
      if (!bankName.trim() || !accountName.trim() || !accountNumber.trim()) {
        setError('All bank account details are required.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'sell',
          amount: usdtAmount,
          method: payoutMethod,
          country: selectedRate.country_code,
          phone_number: payoutMethod === 'mobile_money' ? phoneNumber.trim() : null,
          payment_provider: payoutMethod === 'mobile_money' ? provider : null,
          bank_name: payoutMethod === 'bank_transfer' ? bankName.trim() : null,
          account_name: payoutMethod === 'bank_transfer' ? accountName.trim() : null,
          account_number: payoutMethod === 'bank_transfer' ? accountNumber.trim() : null,
          exchange_rate: Number(selectedRate.buy_rate),
          local_currency: selectedRate.currency,
          local_amount: localPayout,
          fee: 0, // Sell transactions are typically free or fee is built into the rate margin
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete transaction.');
      }

      setIsSuccess(true);
      setWallet(prev => prev ? { ...prev, balance: prev.balance - usdtAmount } : null);
      setAmount('');
      setPhoneNumber('');
      setBankName('');
      setAccountName('');
      setAccountNumber('');
    } catch (err: any) {
      setError(err.message || 'An error occurred while trying to sell USDT.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading sell portal..." fullPage />;
  }

  const selectedCountryMeta = selectedRate ? COUNTRIES.find((c) => c.code === selectedRate.country_code) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Sell USDT"
        subtitle="Exchange your digital dollars (USDT) instantly for local fiat currency sent directly to your Mobile Money or Bank Account."
      />

      {isSuccess ? (
        <Card className="border-green-200 bg-green-50/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
              <Check className="h-6 w-6 stroke-[3]" />
            </div>
            <CardTitle className="text-xl text-green-900 font-extrabold font-space">Sell Order Placed!</CardTitle>
            <CardDescription className="text-green-700 font-medium">
              We are processing your local fiat disbursement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <p className="text-center font-semibold text-slate-700">
              Payouts to Mobile Money are usually completed within 5-15 minutes. Bank transfers may take up to 2 hours.
            </p>
            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => setIsSuccess(false)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl"
              >
                Sell More USDT
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
            <CardTitle className="text-lg font-bold text-slate-800">Sell Order Form</CardTitle>
            <CardDescription>
              Sell crypto stablecoins. Available: {formatCurrency(availableBalance, 'USDT')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Select Country Rate */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                  Select Payout Country & Currency
                </label>
                <select
                  value={selectedRate?.id || ''}
                  onChange={(e) => handleRateChange(e.target.value)}
                  className="w-full h-11 px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                >
                  {rates.map((r) => {
                    const meta = COUNTRIES.find((c) => c.code === r.country_code);
                    return (
                      <option key={r.id} value={r.id}>
                        {meta?.flag} {r.country} ({r.currency}) — Buy Rate: {Number(r.buy_rate).toLocaleString()} {r.currency}/USDT
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Amount Inputs */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block" htmlFor="amount">
                    Amount of USDT to Sell
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
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                    You Receive (Local Currency)
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={selectedRate ? `${localPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${selectedRate.currency}` : '0.00'}
                      disabled
                      className="rounded-xl font-extrabold border-slate-200 bg-slate-50 text-slate-800 h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Payout Method */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                  Select Payout Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('mobile_money')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all duration-200 ${
                      payoutMethod === 'mobile_money'
                        ? 'border-indigo-600 bg-indigo-50/30 text-indigo-950 shadow-md shadow-indigo-600/5 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Smartphone className="h-4 w-4" />
                    Mobile Money
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayoutMethod('bank_transfer')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all duration-200 ${
                      payoutMethod === 'bank_transfer'
                        ? 'border-indigo-600 bg-indigo-50/30 text-indigo-950 shadow-md shadow-indigo-600/5 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Building className="h-4 w-4" />
                    Bank Transfer
                  </button>
                </div>
              </div>

              {/* Conditional Fields based on method */}
              {payoutMethod === 'mobile_money' ? (
                <div className="space-y-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                      Mobile Money Network Operator
                    </label>
                    <select
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      className="w-full h-11 px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                    >
                      {selectedCountryMeta?.mobileMoney ? (
                        selectedCountryMeta.mobileMoney.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))
                      ) : (
                        <option value="">No operators configured</option>
                      )}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block" htmlFor="phone">
                      Recipient Mobile Money Phone Number
                    </label>
                    <Input
                      id="phone"
                      type="text"
                      placeholder="e.g. +265999912345"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="rounded-xl border-slate-200 focus-visible:ring-indigo-600 text-slate-800 h-11 font-semibold"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block" htmlFor="bankName">
                      Bank Name
                    </label>
                    <Input
                      id="bankName"
                      type="text"
                      placeholder="e.g. National Bank of Malawi"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="rounded-xl border-slate-200 focus-visible:ring-indigo-600 text-slate-800 h-11 font-semibold"
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block" htmlFor="accName">
                        Account Holder Name
                      </label>
                      <Input
                        id="accName"
                        type="text"
                        placeholder="John Doe"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        className="rounded-xl border-slate-200 focus-visible:ring-indigo-600 text-slate-800 h-11 font-semibold"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block" htmlFor="accNum">
                        Account Number
                      </label>
                      <Input
                        id="accNum"
                        type="text"
                        placeholder="1002345678"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="rounded-xl border-slate-200 focus-visible:ring-indigo-600 text-slate-800 h-11 font-semibold"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Rate Summary */}
              {selectedRate && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                    <RefreshCw className="h-4 w-4 animate-spin text-slate-400" style={{ animationDuration: '6s' }} />
                    <span>Current Rate Locked</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-800">
                    1.00 USDT = {Number(selectedRate.buy_rate).toLocaleString()} {selectedRate.currency}
                  </span>
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
                {isSubmitting ? 'Confirming Order...' : 'Confirm Sell Order'}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
