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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/10 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              Now supporting USDT across 6 African countries
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-[1.05]">
              The easiest way to{' '}
              <span className="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                buy, sell & send
              </span>{' '}
              USDT in Africa
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl text-slate-600 leading-relaxed">
              Nyasawallet lets you trade USDT with mobile money, bank transfer, or card —
              instantly, securely, and at the best rates. No crypto exchange account needed.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-700 transition-all duration-200"
              >
                Create Free Account
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all duration-200"
              >
                Sign In
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
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
      <section className="border-y border-slate-100 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="font-display text-3xl font-extrabold text-brand-600">$2M+</p>
              <p className="text-sm text-slate-500 mt-1">Total volume traded</p>
            </div>
            <div>
              <p className="font-display text-3xl font-extrabold text-brand-600">15,000+</p>
              <p className="text-sm text-slate-500 mt-1">Active users</p>
            </div>
            <div>
              <p className="font-display text-3xl font-extrabold text-brand-600">6</p>
              <p className="text-sm text-slate-500 mt-1">Countries supported</p>
            </div>
            <div>
              <p className="font-display text-3xl font-extrabold text-brand-600">&lt; 2 min</p>
              <p className="text-sm text-slate-500 mt-1">Average settlement time</p>
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
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div>
                <p className="text-sm text-slate-500">You pay</p>
                <p className="text-2xl font-bold text-slate-900">MWK 175,000</p>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 border border-slate-200">
                <Smartphone className="h-4 w-4 text-brand-500" />
                <span className="text-sm font-medium">MTN MoMo</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                <ArrowRight className="h-5 w-5 rotate-90" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-brand-50 p-4">
              <div>
                <p className="text-sm text-brand-600">You receive</p>
                <p className="text-2xl font-bold text-brand-700">100 USDT</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-bold">
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
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-400 mb-1">Recipient</p>
              <p className="font-medium text-slate-900">grace.mhango</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-400 mb-1">Amount</p>
              <p className="font-medium text-slate-900">50.00 USDT</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-green-50 p-4">
              <span className="text-sm font-medium text-green-700">Status</span>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500" />
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
            <div className="relative mx-auto max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-white shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600">
                  <Wallet className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-slate-300">Nyasawallet</span>
              </div>
              <div className="mb-6">
                <p className="text-xs text-slate-400 mb-1">Card Number</p>
                <p className="font-mono text-lg tracking-wider">•••• •••• •••• 4242</p>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Holder</p>
                  <p className="text-sm font-medium">Arthur Chibondo</p>
                </div>
                <div className="flex gap-1">
                  <div className="h-6 w-6 rounded-full bg-red-500/80" />
                  <div className="h-6 w-6 rounded-full bg-yellow-500/80 -ml-3" />
                </div>
              </div>
            </div>
          </div>
        }
      />

      {/* How It Works */}
      <StepsSection
        subtitle="How it works"
        title="Get started in 3 simple steps"
        steps={[
          {
            number: '01',
            title: 'Create your account',
            description: 'Sign up with your email and phone number. Verify your identity in minutes with our KYC process.',
          },
          {
            number: '02',
            title: 'Fund your wallet',
            description: 'Deposit using mobile money, bank transfer, or card. Your USDT appears in your wallet instantly.',
          },
          {
            number: '03',
            title: 'Trade or send',
            description: 'Buy, sell, send, or spend USDT — all from one app. Track everything in real-time.',
          },
        ]}
      />

      {/* Security Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
              Security you can trust
            </h2>
            <p className="text-lg text-slate-600">
              Your funds and data are protected by industry-leading security measures.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 mb-5">
                <Lock className="h-7 w-7 text-brand-600" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 mb-2">Encrypted & Secure</h3>
              <p className="text-sm text-slate-600">All transactions are encrypted with 256-bit SSL. Your data is never shared.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 mb-5">
                <Shield className="h-7 w-7 text-brand-600" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 mb-2">KYC Verified</h3>
              <p className="text-sm text-slate-600">Identity verification protects every user and prevents fraud on the platform.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 mb-5">
                <TrendingUp className="h-7 w-7 text-brand-600" />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 mb-2">Transparent Pricing</h3>
              <p className="text-sm text-slate-600">No hidden fees. You see exactly what you pay and receive before every transaction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        heading="Ready to get started with Nyasawallet?"
        subtext="Join 15,000+ users who are already trading and sending USDT across Africa. It takes less than 2 minutes to set up."
        buttonText="Create Free Account"
        buttonHref="/auth/sign-up"
        secondaryButtonText="Sign In"
        secondaryButtonHref="/auth/login"
      />
    </>
  );
}
