// @ts-nocheck
import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Globe, Coins, CheckCircle, Smartphone, HelpCircle } from 'lucide-react';
import StepsSection from '@/components/marketing/steps-section';
import CTASection from '@/components/marketing/cta-section';

export default function MobileMoneyPage() {
  const steps = [
    {
      number: '1',
      title: 'Enter Phone Number',
      description: 'Enter your registered mobile money phone number and select your provider in the deposit panel.',
    },
    {
      number: '2',
      title: 'Approve Pin Prompt',
      description: 'You will receive an automated pop-up prompt on your mobile device. Enter your secret PIN to authorize.',
    },
    {
      number: '3',
      title: 'Auto-convert to USDT',
      description: 'The moment the transaction confirms, local kwacha is converted into fully-collateralized USDT inside your wallet.',
    },
  ];

  const countries = [
    {
      name: 'Malawi',
      flag: 'MW',
      networks: ['TNM Mpamba', 'Airtel Money'],
      speed: 'Instant (< 30s)',
      fee: 'Low (0.5%)',
    },
    {
      name: 'Kenya',
      flag: 'KE',
      networks: ['Safaricom M-Pesa', 'Airtel Money'],
      speed: 'Instant (< 10s)',
      fee: 'Lowest (0.25%)',
    },
    {
      name: 'Zambia',
      flag: 'ZM',
      networks: ['MTN Mobile Money', 'Airtel Money'],
      speed: 'Instant (< 30s)',
      fee: 'Low (0.5%)',
    },
    {
      name: 'Uganda',
      flag: 'UG',
      networks: ['MTN MoMo', 'Airtel Money'],
      speed: 'Instant (< 1 min)',
      fee: 'Low (0.5%)',
    },
  ];

  const faqs = [
    {
      q: 'Do I need to manually exchange my funds once I deposit?',
      a: 'No. The entire process is automated. When you deposit kwacha or any supported mobile money currency through our Mobile Money gateway, our backend automatically swaps the local currency at our guaranteed live rate and credits your wallet directly in USDT.',
    },
    {
      q: 'Will I get an SMS notification?',
      a: 'Yes. You will receive standard confirmation messages from both your mobile money operator (TNM, Airtel, Safaricom, etc.) and a transaction email/app notification from Nyasawallet confirming the credited USDT amount.',
    },
    {
      q: 'Is it safe to type my mobile money details?',
      a: 'Absolutely. We do not store or manage your mobile money PIN. The pop-up prompt is securely triggered using regulated, aggregate payment gateway partners, and the final PIN verification occurs entirely on your telecom provider’s secure network.',
    },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Text */}
            <div className="lg:col-span-7 text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-600 ring-1 ring-inset ring-brand-600/10 mb-6">
                Mobile Money Bridge
              </span>
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.15]">
                Convert Mobile <br />
                Money to <span className="bg-gradient-to-r from-brand-600 to-emerald-600 bg-clip-text text-transparent">USDT Instantly</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
                The fastest way to swap local fiat for digital assets in Africa. No bank account required. Send mobile money, enter your PIN, and receive stable, global USDT straight to your phone.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                <a
                  href="/auth/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-md hover:bg-brand-700 transition-all duration-200"
                >
                  Convert Mobile Money
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Right Column: Dynamic Mobile Money Mockup */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="absolute -inset-4 rounded-3xl bg-slate-100/50 [mask-image:radial-gradient(closest-side,white,transparent)]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-emerald-100/50 blur-3xl -z-10" />

              <div className="relative z-10 w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100/50">
                <h3 className="font-display text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-emerald-600" />
                  Deposit Flow Mockup
                </h3>

                <div className="space-y-4">
                  {/* Step visual 1 */}
                  <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">1. Selected Network</p>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">TNM Mpamba (+265 88...)</p>
                    </div>
                    <span className="text-[10px] rounded-full bg-brand-100 text-brand-700 px-2 py-0.5 font-bold">Malawi</span>
                  </div>

                  {/* Step visual 2 */}
                  <div className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase">2. Status</p>
                      <p className="text-xs font-bold text-emerald-950 mt-0.5">Waiting for PIN Approval</p>
                    </div>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>

                  {/* Push notification banner mockup */}
                  <div className="rounded-xl bg-slate-900 p-4 text-white shadow-lg animate-pulse-blue">
                    <p className="text-[9px] text-brand-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Smartphone className="h-3 w-3" /> TNM Mpamba Prompt
                    </p>
                    <p className="text-xs font-medium text-slate-200 mt-2">
                      Authorize payment of MWK 50,000 to Nyasawallet. Enter your PIN to confirm.
                    </p>
                    <div className="flex gap-2 mt-3">
                      <span className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded font-bold cursor-pointer">Cancel</span>
                      <span className="text-[10px] bg-brand-600 hover:bg-brand-500 px-2 py-1 rounded font-bold cursor-pointer">Confirm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Providers Per Country */}
      <section className="py-16 sm:py-24 bg-slate-50/50 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Supported Networks Across Borders
            </h2>
            <p className="mt-4 text-base text-slate-600">
              We connect with Africa’s most popular mobile wallet operators, ensuring high-speed transfers and direct local settlement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {countries.map((country, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="text-slate-400 text-xs font-mono px-1.5 py-0.5 border border-slate-200 rounded">{country.flag}</span>
                      {country.name}
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                  <hr className="my-3 border-slate-100" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Supported Networks</p>
                  <ul className="space-y-1.5 mb-6">
                    {country.networks.map((net, i) => (
                      <li key={i} className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-brand-500 rounded-full" />
                        {net}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-500 flex justify-between">
                  <span>Speed: <span className="text-emerald-600">{country.speed}</span></span>
                  <span>Fee: <span className="text-slate-700">{country.fee}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps section */}
      <StepsSection
        subtitle="Quick Process"
        title="From Cash to Crypto in 3 Steps"
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
              Mobile Money Conversions
            </h2>
            <p className="mt-4 text-slate-600">
              Understand how our instant liquidity bridge processes fiat-to-USDT stablecoin transactions securely.
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
        heading="Convert Your Mobile Money Instantly"
        subtext="Sign up for Nyasawallet, choose your provider, and load your secure USDT balance using Airtel Money or TNM Mpamba today."
        buttonText="Convert Now"
        buttonHref="/auth/register"
        secondaryButtonText="Compare Rates"
        secondaryButtonHref="#"
      />
    </div>
  );
}
