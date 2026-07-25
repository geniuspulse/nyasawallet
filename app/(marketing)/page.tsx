// @ts-nocheck
import Link from 'next/link';
import { Wallet, ArrowRight, Shield, Zap, Globe, Smartphone, TrendingUp, Lock } from 'lucide-react';
import FeatureSection from '@/components/marketing/feature-section';
import StepsSection from '@/components/marketing/steps-section';
import CTASection from '@/components/marketing/cta-section';

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 overflow-hidden">
        {/* Grid pattern background */}
        <div className="absolute inset-0 grid-pattern opacity-40 -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/10 mb-8 animate-slide-up">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 badge-pulse" />
              Now supporting USDT across 6 African countries
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-[1.05] animate-slide-up delay-100">
              The easiest way to{' '}
              <span className="gradient-text">
                buy, sell & send
              </span>{' '}
              USDT in Africa
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl text-slate-600 leading-relaxed animate-slide-up delay-200">
              Nyasawallet lets you trade USDT with mobile money, bank transfer, or card —
              instantly, securely, and at the best rates. No crypto exchange account needed.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-slide-up delay-300">
              <Link
                href="/auth/sign-up"
                className="shine-btn group inline-flex items-center gap-2 rounded-xl bg-brand-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-500/30 transition-all duration-200 active:scale-[0.97]"
              >
                Create Free Account
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm px-7 py-3.5 text-base font-semibold text-slate-700 shadow-sm hover:bg-white hover:border-slate-300 transition-all duration-200 active:scale-[0.97]"
              >
                Sign In
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500 animate-slide-up delay-500">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-brand-500" />
                Bank-grade security
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-brand-500" />
                Instant transactions
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-brand-500" />
                Available in 6 countries
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-100 bg-slate-50/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="group">
              <p className="font-display text-3xl font-extrabold gradient-text transition-transform group-hover:scale-110 origin-center">$2M+</p>
              <p className="text-sm text-slate-500 mt-1 font-medium">Total volume traded</p>
            </div>
            <div className="group">
              <p className="font-display text-3xl font-extrabold gradient-text transition-transform group-hover:scale-110 origin-center">15,000+</p>
              <p className="text-sm text-slate-500 mt-1 font-medium">Active users</p>
            </div>
            <div className="group">
              <p className="font-display text-3xl font-extrabold gradient-text transition-transform group-hover:scale-110 origin-center">6</p>
              <p className="text-sm text-slate-500 mt-1 font-medium">Countries supported</p>
            </div>
            <div className="group">
              <p className="font-display text-3xl font-extrabold gradient-text transition-transform group-hover:scale-110 origin-center">&lt; 2 min</p>
              <p className="text-sm text-slate-500 mt-1 font-medium">Average settlement time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature: Buy USDT */}
      <FeatureSection
        badge="Buy USDT"
        title="Buy USDT with mobile money or bank transfer"
        description="Purchase USDT directly using MTN MoMo, Airtel Money, bank transfer, or card. Get the best rates with transparent fees — no hidden charges, no surprises."
        bullets={[
          'Pay with MTN MoMo, Airtel Money, or bank transfer',
          'Live exchange rates updated in real-time',
          'USDT delivered to your wallet in under 2 minutes',
          'No minimum purchase — start from $1',
        ]}
        ctaText="Start buying USDT"
        ctaHref="/buy-usdt"
        visual={
          <div className="space-y-4 p-6">
            <div className="flex items-center justify-between rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 border border-slate-200/50">
              <div>
                <p className="text-sm text-slate-500">You pay</p>
                <p className="text-2xl font-bold text-slate-900">MWK 175,000</p>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 border border-slate-200 shadow-sm">
                <Smartphone className="h-4 w-4 text-brand-500" />
                <span className="text-sm font-medium">MTN MoMo</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-md shadow-brand-500/30">
                <ArrowRight className="h-5 w-5 rotate-90" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gradient-to-br from-brand-50 to-brand-100/50 p-4 border border-brand-100">
              <div>
                <p className="text-sm text-brand-600">You receive</p>
                <p className="text-2xl font-bold text-brand-700">100 USDT</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white text-xs font-bold shadow-sm">
                  $
                </div>
                <span className="text-sm font-medium text-brand-700">USDT</span>
              </div>
            </div>
          </div>
        }
      />

      {/* Feature: Send Money (reversed) */}
      <FeatureSection
        badge="Send Money"
        title="Send USDT to anyone, anywhere in Africa"
        description="Transfer USDT to friends, family, or businesses across the continent. All you need is their wallet address or Nyasawallet username — no bank details required."
        bullets={[
          'Send to any USDT wallet address instantly',
          'Zero transfer fees between Nyasawallet users',
          'Track every transaction with real-time confirmations',
          'Available 24/7 — including weekends and holidays',
        ]}
        ctaText="Learn about sending"
        ctaHref="/send-money"
        reverse
        visual={
          <div className="space-y-3 p-6">
            <div className="rounded-xl border border-slate-200/50 bg-gradient-to-br from-white to-slate-50/50 p-4">
              <p className="text-xs text-slate-400 mb-1">Recipient</p>
              <p className="font-medium text-slate-900">grace.mhango</p>
            </div>
            <div className="rounded-xl border border-slate-200/50 bg-gradient-to-br from-white to-slate-50/50 p-4">
              <p className="text-xs text-slate-400 mb-1">Amount</p>
              <p className="font-medium text-slate-900">50.00 USDT</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 border border-green-100">
              <span className="text-sm font-medium text-green-700">Status</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Delivered in 3s
              </span>
            </div>
          </div>
        }
      />

      {/* Feature: Virtual Card */}
      <FeatureSection
        badge="Virtual Card"
        title="Spend USDT anywhere with a virtual card"
        description="Get a virtual Visa card funded by your USDT balance. Use it for online shopping, subscriptions, and payments anywhere Visa is accepted — no traditional bank account required."
        bullets={[
          'Virtual Visa card funded by your USDT balance',
          'Instant card creation — no paperwork needed',
          'Spend on international sites like Amazon, Netflix, and more',
          'Real-time spending notifications and controls',
        ]}
        ctaText="Get your card"
        ctaHref="/virtual-card"
        visual={
          <div className="p-6">
            <div className="relative mx-auto max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-2xl shadow-slate-900/30">
              {/* Card chip effect */}
              <div className="absolute top-1/2 left-6 h-8 w-12 -translate-y-1/2 rounded-md bg-gradient-to-br from-gold-400/80 to-gold-600/80 opacity-20 blur-sm" />

              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/30">
                  <Wallet className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-slate-300">Nyasawallet</span>
              </div>
              <div className="mb-6 relative z-10">
                <p className="text-xs text-slate-400 mb-1">Card Number</p>
                <p className="font-mono text-lg tracking-wider">•••• •••• •••• 4242</p>
              </div>
              <div className="flex items-end justify-between relative z-10">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Holder</p>
                  <p className="text-sm font-medium">Arthur Chibondo</p>
                </div>
                <div className="flex gap-1">
                  <div className="h-6 w-6 rounded-full bg-red-500/80" />
                  <div className="h-6 w-6 rounded-full bg-gold-400/80 -ml-3" />
                </div>
              </div>
            </div>
          </div>
        }
      />

      {/* How It Works */}
      <StepsSection />

      {/* CTA */}
      <CTASection
        heading="Ready to take control of your money?"
        subtext="Join thousands of users across Africa who trust Nyasawallet for their USDT transactions. Create your free account in under a minute."
        buttonText="Create Free Account"
        buttonHref="/auth/sign-up"
        secondaryButtonText="Learn More"
        secondaryButtonHref="/buy-usdt"
      />
    </>
  );
}
