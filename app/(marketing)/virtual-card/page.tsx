// @ts-nocheck
import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Globe, Coins, CheckCircle, HelpCircle, CreditCard, Sparkles, ShoppingBag, Lock } from 'lucide-react';
import StepsSection from '@/components/marketing/steps-section';
import CTASection from '@/components/marketing/cta-section';

export default function VirtualCardPage() {
  const steps = [
    {
      number: '1',
      title: 'Generate Card Instantly',
      description: 'Click "Issue Card" inside your secure dashboard. Choose Visa or Mastercard network options.',
    },
    {
      number: '2',
      title: 'Top Up with USDT',
      description: 'Load your card balance directly using USDT from your digital wallet with 1:1 parity and zero fees.',
    },
    {
      number: '3',
      title: 'Spend Globally',
      description: 'Copy your card details and start checking out online. Pay for ads, streaming services, or server hosting with ease.',
    },
  ];

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-brand-600" />,
      title: 'Instant Issuance',
      description: 'No paper forms or waiting in queues. Create, configure, and activate your card in under 30 seconds.',
    },
    {
      icon: <Globe className="h-6 w-6 text-brand-600" />,
      title: 'Global Acceptance',
      description: 'Spend anywhere online where Visa or Mastercard is accepted. Perfect for Netflix, AWS, OpenAI, Meta Ads, and more.',
    },
    {
      icon: <Lock className="h-6 w-6 text-brand-600" />,
      title: 'Enhanced Security',
      description: 'Freeze and unfreeze your card instantly with one tap. Set customizable transaction limits to secure your funds.',
    },
    {
      icon: <Coins className="h-6 w-6 text-brand-600" />,
      title: 'Seamless Top-ups',
      description: 'Fund your card anytime directly from your USDT wallet. Instant conversions with no bank approval required.',
    },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Hero Left: Text Content */}
            <div className="lg:col-span-6 text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-600 ring-1 ring-inset ring-brand-600/10 mb-6">
                <Sparkles className="h-3.5 w-3.5 text-brand-500 fill-current" />
                Virtual Dollar Debit Cards
              </span>
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.15]">
                Spend USDT Anywhere <br />
                with a <span className="bg-gradient-to-r from-brand-600 to-brand-600 bg-clip-text text-transparent">Virtual Card</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
                Unlock global shopping. Generate a premium virtual USD debit card instantly, fund it using your stable USDT wallet, and make safe online payments with absolute freedom.
              </p>
              <div className="mt-10">
                <a
                  href="/auth/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-md hover:bg-brand-700 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 transition-all duration-200"
                >
                  Get Your Card
                  <ArrowRight className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Hero Right: Card Mockup visual */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <div className="absolute -inset-4 rounded-3xl bg-slate-100/50 [mask-image:radial-gradient(closest-side,white,transparent)]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-brand-100/50 blur-3xl -z-10" />

              {/* Glossy Gradient Card Container */}
              <div className="relative z-10 w-full max-w-md aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 p-6 sm:p-8 shadow-2xl shadow-brand-900/30 overflow-hidden border border-slate-800 text-white flex flex-col justify-between">
                {/* Glossy light sweep / hologram effect */}
                <div className="absolute -inset-x-20 -inset-y-20 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_60%)] pointer-events-none" />
                <div className="absolute right-0 bottom-0 h-40 w-40 bg-[radial-gradient(circle_at_bottom_right,rgba(217,119,6,0.08),transparent_60%)] pointer-events-none" />

                {/* Card Top */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-display text-xs font-bold text-slate-400 uppercase tracking-widest">Nyasawallet</span>
                    <p className="text-[9px] text-brand-400 font-bold mt-0.5">PREMIUM VIRTUAL DOLLAR</p>
                  </div>
                  {/* Card Chip Mockup */}
                  <div className="h-9 w-12 rounded bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-300 p-1 opacity-90 shadow-sm border border-amber-300">
                    <div className="grid grid-cols-3 gap-0.5 h-full w-full opacity-60">
                      <div className="border-r border-b border-amber-800" />
                      <div className="border-r border-b border-amber-800" />
                      <div className="border-b border-amber-800" />
                      <div className="border-r border-amber-800" />
                      <div className="border-r border-amber-800" />
                      <div className="border-amber-800" />
                    </div>
                  </div>
                </div>

                {/* Card Center: Card Number */}
                <div className="my-4">
                  <p className="font-mono text-lg sm:text-2xl font-semibold tracking-widest text-slate-100">
                    4532 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 8240
                  </p>
                </div>

                {/* Card Bottom */}
                <div className="flex justify-between items-end">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase tracking-wider">Card Holder</p>
                      <p className="font-display text-xs font-bold mt-0.5 text-slate-200">Arthur Chibondo</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase tracking-wider">Expires</p>
                      <p className="font-mono text-xs font-bold mt-0.5 text-slate-200">12 / 29</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase tracking-wider">CVV</p>
                      <p className="font-mono text-xs font-bold mt-0.5 text-slate-200">&bull;&bull;&bull;</p>
                    </div>
                  </div>

                  {/* Visa Logo Mock */}
                  <div className="flex flex-col items-end">
                    <span className="font-display text-lg font-black italic text-white tracking-tight">
                      VISA
                    </span>
                    <span className="text-[7px] text-slate-400 tracking-wider">PLATINUM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-16 sm:py-24 bg-slate-50/50 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Engineered for Borderless Commerce
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Our virtual debit card bridges the gap between your local mobile money and global SaaS, advertising, and online retail spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 mb-6">
                  {feat.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-3">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps section */}
      <StepsSection
        subtitle="Instant Issuance Process"
        title="Three Steps to Spend Anywhere"
        steps={steps}
      />

      {/* Use Cases Grid */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">
                Finally, a Dollar Card That Works
              </h2>
              <p className="text-base text-slate-600 leading-relaxed mb-6">
                Most Malawian banks place low monthly spending limits on international cards or reject payments for advertising services entirely. Nyasawallet virtual dollar cards bypass local forex restrictions, offering an uncapped, fully legal solution for modern professionals.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <h4 className="font-bold text-sm text-slate-900 mb-1">Freelancers</h4>
                  <p className="text-xs text-slate-500">Pay for subscriptions like Adobe, ChatGPT, Github, and digital tools instantly.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <h4 className="font-bold text-sm text-slate-900 mb-1">Advertisers</h4>
                  <p className="text-xs text-slate-500">Fund your Google Ads, Facebook Ads, and TikTok campaigns without decline headaches.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <h4 className="font-bold text-sm text-slate-900 mb-1">Shoppers</h4>
                  <p className="text-xs text-slate-500">Buy goods on Amazon, Alibaba, or ASOS and enjoy smooth dollar checkout.</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <h4 className="font-bold text-sm text-slate-900 mb-1">Streaming</h4>
                  <p className="text-xs text-slate-500">Pay for Netflix, Spotify, or Apple Music securely with stable automatic recurring payments.</p>
                </div>
              </div>
            </div>
            {/* Visual preview of checkout */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-inner">
              <h3 className="font-display font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-brand-600" />
                Checkout Preview
              </h3>
              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-sm">
                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Service</span>
                  <span className="font-semibold text-slate-900">OpenAI API / ChatGPT Plus</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Card Selected</span>
                  <span className="font-semibold text-slate-900">Nyasawallet Virtual (&bull;&bull;&bull;&bull; 8240)</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-semibold text-slate-900">$20.00 USD</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Transaction Status</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Approved
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        heading="Unlock Your Global Spending Power"
        subtext="Create your account, deposit MWK, convert to USDT, and generate your virtual card in under 5 minutes."
        buttonText="Get Your Card Now"
        buttonHref="/auth/register"
        secondaryButtonText="Learn More"
        secondaryButtonHref="#"
      />
    </div>
  );
}
