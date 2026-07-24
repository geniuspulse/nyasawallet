// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { HelpCircle, ArrowRight, ShieldCheck, Zap, Coins, CheckCircle, Smartphone, Landmark } from 'lucide-react';
import StepsSection from '@/components/marketing/steps-section';
import CTASection from '@/components/marketing/cta-section';

export default function BuyUsdtPage() {
  const [mwkAmount, setMwkAmount] = useState('50000');
  const [paymentMethod, setPaymentMethod] = useState<'mpamba' | 'airtel' | 'bank'>('mpamba');

  // Exchange rates per MWK
  const rates = {
    mpamba: 1730,
    airtel: 1735,
    bank: 1710,
  };

  const getCalculatedUsdt = () => {
    const rate = rates[paymentMethod];
    const amount = parseFloat(mwkAmount);
    if (isNaN(amount) || amount <= 0) return '0.00';
    return (amount / rate).toFixed(2);
  };

  const steps = [
    {
      number: '1',
      title: 'Create an Account',
      description: 'Sign up in under 2 minutes with your Malawian phone number and verify your identity.',
    },
    {
      number: '2',
      title: 'Choose Payment Method',
      description: 'Select TNM Mpamba, Airtel Money, or Standard Bank Transfer and enter the amount you want to buy.',
    },
    {
      number: '3',
      title: 'Receive USDT Instantly',
      description: 'Approve the automated mobile money prompt, and your USDT is instantly deposited into your safe wallet.',
    },
  ];

  const faqs = [
    {
      q: 'Which mobile money providers are supported in Malawi?',
      a: 'We fully support both TNM Mpamba and Airtel Money. You can initiate deposits directly from either wallet with automated prompt approvals.',
    },
    {
      q: 'How fast will I receive my USDT?',
      a: 'Once you approve the mobile money prompt on your phone or complete the bank transfer, the USDT is minted or transferred to your wallet instantly (usually under 30 seconds).',
    },
    {
      q: 'What is the minimum and maximum amount I can buy?',
      a: 'The minimum purchase is 5,000 MWK. The daily maximum is 10,000,000 MWK depending on your verification tier (Basic, Standard, or Premium).',
    },
    {
      q: 'Are there any extra transaction fees?',
      a: 'None! Our displayed conversion rate is fully all-inclusive. You will only pay the standard mobile money network sending fees if applicable.',
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
                Direct Fiat-to-Crypto Gateway
              </span>
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-tight">
                Buy USDT Instantly <br />
                in <span className="text-brand-600">Malawi</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
                Get the best kwacha exchange rates. Fund your digital wallet securely using your preferred mobile money network (Airtel Money, TNM Mpamba) or secure bank deposits. Zero middlemen, zero stress.
              </p>

              {/* Badges / Guarantees */}
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                  <ShieldCheck className="h-5 w-5 text-brand-600 shrink-0" />
                  <span>Licensed and compliant custody</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                  <Zap className="h-5 w-5 text-brand-600 shrink-0" />
                  <span>Automated push payment approvals</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                  <Coins className="h-5 w-5 text-brand-600 shrink-0" />
                  <span>Real-time on-chain transparency</span>
                </div>
              </div>
            </div>

            {/* Interactive Buy Widget */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-100/50">
                <h3 className="font-display text-lg font-bold text-slate-900 mb-4">
                  Buy USDT Calculator
                </h3>

                {/* Amount input */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="mwk-amount" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      You Pay (MWK)
                    </label>
                    <div className="relative rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all">
                      <input
                        id="mwk-amount"
                        type="number"
                        value={mwkAmount}
                        onChange={(e) => setMwkAmount(e.target.value)}
                        placeholder="Enter Kwacha amount"
                        className="w-full bg-transparent font-display text-xl font-bold text-slate-900 focus:outline-none border-none p-0 focus:ring-0"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-display font-bold text-slate-500 text-sm">
                        MWK
                      </span>
                    </div>
                  </div>

                  {/* Payment provider tabs */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Select Payment Network
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
                        <span className="text-[9px] text-slate-400">1,730 MWK</span>
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
                        <span className="text-[9px] text-slate-400">1,735 MWK</span>
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
                        <span className="text-[9px] text-slate-400">1,710 MWK</span>
                      </button>
                    </div>
                  </div>

                  {/* Calculated Output */}
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      You Receive (USDT)
                    </p>
                    <div className="flex items-baseline justify-between">
                      <p className="font-display text-2xl font-bold text-brand-600">
                        {getCalculatedUsdt()} USDT
                      </p>
                      <p className="text-[10px] text-slate-400">Rate: 1 USDT = {rates[paymentMethod]} MWK</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-base font-semibold text-white shadow-md hover:bg-brand-700 transition-all duration-200"
                  >
                    Start Buying USDT
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
              <h3 className="font-display font-bold text-slate-900 text-lg">Live Exchange Rates</h3>
              <p className="text-sm text-slate-500 mt-1">Rates updated less than 1 min ago. Fast automatic processing.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-auto">
              <div className="bg-white p-3.5 rounded-xl border border-slate-150 shadow-sm text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">TNM Mpamba</span>
                <p className="font-display text-base font-extrabold text-slate-900 mt-0.5">1,730 MWK</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-150 shadow-sm text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Airtel Money</span>
                <p className="font-display text-base font-extrabold text-slate-900 mt-0.5">1,735 MWK</p>
              </div>
              <div className="col-span-2 md:col-span-1 bg-white p-3.5 rounded-xl border border-slate-150 shadow-sm text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Bank Transfer</span>
                <p className="font-display text-base font-extrabold text-slate-900 mt-0.5">1,710 MWK</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps section */}
      <StepsSection
        subtitle="Quick Setup"
        title="Three Simple Steps to Buy USDT"
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
              Buying USDT in Malawi
            </h2>
            <p className="mt-4 text-slate-600">
              Everything you need to know about purchasing USDT stablecoins with Malawian fiat currency.
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
        heading="Ready to Buy USDT?"
        subtext="Create your free wallet, choose your network, and complete your purchase instantly with Airtel Money, TNM Mpamba, or Bank Transfer."
        buttonText="Get Started"
        buttonHref="/auth/register"
        secondaryButtonText="Compare Rates"
        secondaryButtonHref="#"
      />
    </div>
  );
}
