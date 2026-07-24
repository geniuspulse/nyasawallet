// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { HelpCircle, ArrowRight, ShieldCheck, Zap, Coins, CheckCircle, Smartphone, Landmark } from 'lucide-react';
import StepsSection from '@/components/marketing/steps-section';
import CTASection from '@/components/marketing/cta-section';

export default function SellUsdtPage() {
  const [usdtAmount, setUsdtAmount] = useState('50');
  const [paymentMethod, setPaymentMethod] = useState<'mpamba' | 'airtel' | 'bank'>('mpamba');

  // Selling exchange rates: MWK per 1 USDT
  const rates = {
    mpamba: 1695,
    airtel: 1690,
    bank: 1715,
  };

  const getCalculatedMwk = () => {
    const rate = rates[paymentMethod];
    const amount = parseFloat(usdtAmount);
    if (isNaN(amount) || amount <= 0) return '0';
    return Math.round(amount * rate).toLocaleString();
  };

  const steps = [
    {
      number: '1',
      title: 'Enter USDT Amount',
      description: 'Log into your wallet and specify how much USDT you want to sell from your secure balance.',
    },
    {
      number: '2',
      title: 'Select Payout Account',
      description: 'Choose your desired mobile money wallet (Mpamba/Airtel) or enter your local bank details.',
    },
    {
      number: '3',
      title: 'Receive MWK Instantly',
      description: 'Confirm the sale. The transaction resolves instantly, and local Malawian Kwacha is deposited to your chosen account.',
    },
  ];

  const faqs = [
    {
      q: 'Can I sell USDT and get paid directly to my bank account?',
      a: 'Absolutely. We support direct instant payouts to major Malawian banks (National Bank, Standard Bank, NBS Bank, FDH Bank). Select "Bank Transfer" as your payout destination.',
    },
    {
      q: 'How long do mobile money cashouts take?',
      a: 'Payouts to TNM Mpamba and Airtel Money are fully automated. They are processed and sent to your phone number within 2 to 3 minutes of confirming the sale in our app.',
    },
    {
      q: 'Are there high slippage costs when selling?',
      a: 'No. Our rates are locked for 5 minutes once you initiate the sell order. The kwacha amount displayed in the calculator is exactly what you will receive in your account.',
    },
    {
      q: 'Do I need to verify my identity to cash out?',
      a: 'Basic cashouts up to 50,000 MWK per day only require phone number verification. Larger amounts require standard KYC verification for compliance and AML security.',
    },
  ];

  return (
    <div className="relative">
      {/* Hero with Embedded Calculator Grid */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Hero text */}
            <div className="lg:col-span-7 text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-600 ring-1 ring-inset ring-brand-600/10 mb-6">
                Liquidity on Demand
              </span>
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
                Sell USDT for <br />
                <span className="text-brand-600">Kwacha Instantly</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
                Ready to cash out? Swap your stablecoins for MWK instantly. Receive automated mobile money transfers (TNM Mpamba, Airtel Money) or high-speed local bank deposits in minutes. High limits, zero complications.
              </p>

              {/* Badges / Guarantees */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                  <ShieldCheck className="h-5 w-5 text-brand-600 shrink-0" />
                  <span>Transparent exchange rates without hidden fees</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                  <Zap className="h-5 w-5 text-brand-600 shrink-0" />
                  <span>Instant payout system operational 24/7</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                  <Coins className="h-5 w-5 text-brand-600 shrink-0" />
                  <span>Malawi kwacha reserves fully backed</span>
                </div>
              </div>
            </div>

            {/* Interactive Sell Widget */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-100/50">
                <h3 className="font-display text-lg font-bold text-slate-900 mb-4">
                  Sell USDT Calculator
                </h3>

                {/* Amount input */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="usdt-amount" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      You Sell (USDT)
                    </label>
                    <div className="relative rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all">
                      <input
                        id="usdt-amount"
                        type="number"
                        value={usdtAmount}
                        onChange={(e) => setUsdtAmount(e.target.value)}
                        placeholder="Enter USDT amount"
                        className="w-full bg-transparent font-display text-xl font-bold text-slate-900 focus:outline-none border-none p-0 focus:ring-0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-display font-bold text-slate-500 text-sm">
                        USDT
                      </span>
                    </div>
                  </div>

                  {/* Payment provider tabs */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Select Payout Destination
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('mpamba')}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                          paymentMethod === 'mpamba'
                            ? 'border-brand-600 bg-brand-50/50 text-brand-700 ring-1 ring-brand-600'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <Smartphone className="h-4 w-4" />
                        <span className="text-[11px] font-bold">TNM Mpamba</span>
                        <span className="text-[9px] text-slate-400">1,695 MWK</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('airtel')}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                          paymentMethod === 'airtel'
                            ? 'border-brand-600 bg-brand-50/50 text-brand-700 ring-1 ring-brand-600'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <Smartphone className="h-4 w-4" />
                        <span className="text-[11px] font-bold">Airtel Money</span>
                        <span className="text-[9px] text-slate-400">1,690 MWK</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank')}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                          paymentMethod === 'bank'
                            ? 'border-brand-600 bg-brand-50/50 text-brand-700 ring-1 ring-brand-600'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <Landmark className="h-4 w-4" />
                        <span className="text-[11px] font-bold">National Bank</span>
                        <span className="text-[9px] text-slate-400">1,715 MWK</span>
                      </button>
                    </div>
                  </div>

                  {/* Calculated Output */}
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      You Receive (MWK)
                    </p>
                    <div className="flex items-baseline justify-between">
                      <p className="font-display text-2xl font-bold text-brand-600">
                        MWK {getCalculatedMwk()}
                      </p>
                      <p className="text-[10px] text-slate-400">Rate: 1 USDT = {rates[paymentMethod]} MWK</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-base font-semibold text-white shadow-md hover:bg-brand-700 transition-all duration-200"
                  >
                    Start Selling USDT
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Rate Display */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-bold text-slate-900 text-lg">Live Cashout Rates</h3>
              <p className="text-sm text-slate-500 mt-1">Cash out USDT to Kwacha directly. Automated payouts 24/7.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-auto">
              <div className="bg-white p-3.5 rounded-xl border border-slate-150 shadow-sm text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">TNM Mpamba</span>
                <p className="font-display text-base font-extrabold text-slate-900 mt-0.5">1,695 MWK</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-150 shadow-sm text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Airtel Money</span>
                <p className="font-display text-base font-extrabold text-slate-900 mt-0.5">1,690 MWK</p>
              </div>
              <div className="col-span-2 md:col-span-1 bg-white p-3.5 rounded-xl border border-slate-150 shadow-sm text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Bank Transfer</span>
                <p className="font-display text-base font-extrabold text-slate-900 mt-0.5">1,715 MWK</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps section */}
      <StepsSection
        subtitle="Simple Cashout"
        title="Three Simple Steps to Sell USDT"
        steps={steps}
      />

      {/* FAQs Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 ring-1 ring-inset ring-brand-600/10 mb-4">
              <HelpCircle className="h-3.5 w-3.5" />
              Frequently Asked Questions
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Selling USDT in Malawi
            </h2>
            <p className="mt-4 text-slate-600">
              Find answers to the most common questions regarding stablecoin-to-kwacha conversions.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <h3 className="font-display font-bold text-slate-900 text-lg flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 font-bold text-xs mt-0.5">Q</span>
                  {faq.q}
                </h3>
                <p className="mt-3 text-slate-600 text-base leading-relaxed pl-9">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        heading="Ready to Sell Your USDT?"
        subtext="Cash out your holdings into TNM Mpamba, Airtel Money, or direct local bank deposits at the best market rates today."
        buttonText="Sell USDT Now"
        buttonHref="/auth/login"
        secondaryButtonText="View Exchange Rates"
        secondaryButtonHref="#"
      />
    </div>
  );
}
