// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { Loading } from '@/components/ui/loading';
import { VirtualCard, Transaction } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  CreditCard, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  TrendingDown, 
  Globe,
  AlertCircle
} from 'lucide-react';

export default function CardPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string>('Nyasawallet User');
  const [card, setCard] = useState<VirtualCard | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showCvv, setShowCvv] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCardData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          
          // Get profile full name
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('user_id', user.id)
            .single();
          if (profile?.full_name) {
            setFullName(profile.full_name);
          }

          // Get card
          const { data: cardData } = await supabase
            .from('virtual_cards')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (cardData) {
            setCard(cardData as VirtualCard);

            // Fetch card transactions
            const { data: cardTxs } = await supabase
              .from('transactions')
              .select('*')
              .eq('user_id', user.id)
              .eq('method', 'card')
              .order('created_at', { ascending: false });
            
            setTransactions((cardTxs || []) as Transaction[]);
          }
        }
      } catch (err) {
        console.error('Error fetching card data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCardData();
  }, []);

  const handleCreateCard = async () => {
    if (!userId) return;
    setIsCreating(true);
    setError(null);

    try {
      // Generate mock card details
      const cardNumber = '4111' + Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');
      const cvv = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('');
      const expiryMonth = String(new Date().getMonth() + 1).padStart(2, '0');
      const expiryYear = String(new Date().getFullYear() + 4).slice(-2);

      const { data: newCard, error: insertError } = await supabase
        .from('virtual_cards')
        .insert({
          user_id: userId,
          card_number: cardNumber,
          card_holder: fullName,
          expiry_month: expiryMonth,
          expiry_year: expiryYear,
          cvv: cvv,
          balance: 0,
          status: 'active',
          type: 'virtual',
          currency: 'USD',
          spending_limit: 1000,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      setCard(newCard as VirtualCard);
    } catch (err: any) {
      setError(err.message || 'Failed to create virtual card.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleFreeze = async () => {
    if (!card) return;
    setIsTogglingStatus(true);
    setError(null);

    const newStatus = card.status === 'active' ? 'frozen' : 'active';

    try {
      const { error: updateError } = await supabase
        .from('virtual_cards')
        .update({ status: newStatus })
        .eq('id', card.id);

      if (updateError) throw updateError;
      setCard({ ...card, status: newStatus as any });
    } catch (err: any) {
      setError(err.message || 'Failed to update card status.');
    } finally {
      setIsTogglingStatus(false);
    }
  };

  if (loading) {
    return <Loading message="Loading virtual card..." fullPage />;
  }

  const formatCardNumber = (num: string | null) => {
    if (!num) return '•••• •••• •••• ••••';
    if (!showCvv) {
      return `•••• •••• •••• ${num.slice(-4)}`;
    }
    return num.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Virtual USD Card"
        subtitle="Instantly generate a virtual Visa/Mastercard, fund it with USDT, and make global online payments anywhere."
      />

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2 border border-red-100">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {!card ? (
        <div className="max-w-2xl mx-auto text-center py-12 px-6 border border-dashed border-slate-200 bg-white rounded-3xl space-y-6 shadow-sm">
          <div className="mx-auto h-16 w-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
            <CreditCard className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-800 font-space">Get Your USD Virtual Card</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto font-medium">
              Create an instant, secure USD card. Make payments on Netflix, Amazon, Spotify, Facebook Ads, and Google Ads seamlessly with direct funding from your USDT wallet.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-md mx-auto py-2">
            <div className="flex flex-col gap-1">
              <span className="text-indigo-600 font-black text-lg">01</span>
              <span className="text-xs font-bold text-slate-700">Instant Issue</span>
              <p className="text-[10px] text-slate-400 font-medium">Card generated in seconds.</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-indigo-600 font-black text-lg">02</span>
              <span className="text-xs font-bold text-slate-700">Direct USDT Fund</span>
              <p className="text-[10px] text-slate-400 font-medium">Top up directly from balance.</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-indigo-600 font-black text-lg">03</span>
              <span className="text-xs font-bold text-slate-700">Global Use</span>
              <p className="text-[10px] text-slate-400 font-medium">Accepted worldwide.</p>
            </div>
          </div>

          <Button
            onClick={handleCreateCard}
            disabled={isCreating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 px-8 rounded-xl flex items-center justify-center gap-2 mx-auto shadow-lg shadow-indigo-600/10"
          >
            {isCreating ? 'Issuing Card...' : 'Create Virtual Card'}
            {!isCreating && <Plus className="h-4 w-4" />}
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card Showcase Column */}
          <div className="md:col-span-2 space-y-6">
            {/* 3D Glassmorphic Credit Card */}
            <div className="relative w-full aspect-[1.586/1] rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 p-6 sm:p-8 flex flex-col justify-between text-white shadow-xl overflow-hidden border border-indigo-500/20">
              <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 to-transparent pointer-events-none" />
              
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="font-space font-black tracking-wider text-base text-indigo-400">NYASACARD</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Virtual USD</span>
                </div>
                <div className="h-8 w-11 bg-slate-800/40 backdrop-blur-md rounded-lg flex items-center justify-center border border-slate-700/40">
                  <Globe className="h-5 w-5 text-indigo-300" />
                </div>
              </div>

              {/* Card Number */}
              <div className="my-auto space-y-1">
                <p className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-center select-all text-slate-100">
                  {formatCardNumber(card.card_number)}
                </p>
              </div>

              {/* Card Footer */}
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Card Holder</span>
                  <p className="font-space text-sm font-extrabold tracking-wide uppercase select-none">{card.card_holder}</p>
                </div>
                
                <div className="flex gap-6">
                  <div className="space-y-1 text-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Expires</span>
                    <p className="font-mono text-xs font-extrabold select-none">
                      {card.expiry_month}/{card.expiry_year}
                    </p>
                  </div>
                  <div className="space-y-1 text-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">CVV</span>
                    <p className="font-mono text-xs font-extrabold">
                      {showCvv ? card.cvv : '•••'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <Card className="shadow-sm border-slate-200">
              <CardContent className="p-5 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <Badge variant={card.status === 'active' ? 'success' : 'destructive'} className="capitalize font-bold px-3 py-1">
                    {card.status}
                  </Badge>
                  <p className="text-xs text-slate-400 font-semibold">
                    {card.status === 'active' ? 'Card is unlocked and ready for online payments.' : 'Card is currently frozen and will decline payments.'}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCvv(!showCvv)}
                    className="border-slate-200 text-slate-700 h-10 font-bold px-4 rounded-xl flex items-center gap-2"
                  >
                    {showCvv ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showCvv ? 'Hide Details' : 'Show Details'}
                  </Button>
                  
                  <Button
                    onClick={handleToggleFreeze}
                    disabled={isTogglingStatus}
                    variant={card.status === 'active' ? 'destructive' : 'default'}
                    className={`h-10 font-bold px-4 rounded-xl flex items-center gap-2 ${
                      card.status === 'active' 
                        ? 'bg-red-50 hover:bg-red-100 text-red-600 border-none shadow-none' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {card.status === 'active' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    {card.status === 'active' ? 'Freeze Card' : 'Unfreeze Card'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Balance / Pricing Column */}
          <div className="space-y-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-base text-slate-800 font-bold">Card Balance</CardTitle>
                <CardDescription>Available funds on your virtual card</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1 select-none">
                    Card Equity (USD)
                  </span>
                  <span className="font-display font-black text-3xl text-indigo-950">
                    {formatCurrency(Number(card.balance), 'USD')}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 font-semibold space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between text-slate-600 font-bold">
                    <span>Card Limit:</span>
                    <span>${card.spending_limit || '1,000'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Card Fee:</span>
                    <span>$0.00 / mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FX Margin:</span>
                    <span>0% (stable)</span>
                  </div>
                </div>

                <div className="text-[11px] text-indigo-600 font-bold flex items-center gap-1.5 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  Your global digital dollar account is secured.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Full-width Transaction History */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-space select-none">Card Transaction History</h3>
            
            {transactions.length > 0 ? (
              <div className="grid gap-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400">
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {tx.metadata?.vendor || tx.recipient_email || 'Merchant Payment'}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold">{formatDate(tx.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800 font-display">
                        - {formatCurrency(Number(tx.amount), 'USD')}
                      </p>
                      <Badge variant="success" className="text-[9px] uppercase font-extrabold tracking-wider py-0 px-2 mt-1">
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-10 border border-dashed border-slate-200 bg-white rounded-2xl shadow-sm">
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <CreditCard className="h-10 w-10 text-slate-300 mb-3 animate-pulse" />
                  <p className="text-slate-500 font-bold text-sm select-none">No card payments found</p>
                  <p className="text-xs text-slate-400 mt-1 select-none max-w-xs mx-auto">
                    Use your card details to shop online and transactions will populate here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
