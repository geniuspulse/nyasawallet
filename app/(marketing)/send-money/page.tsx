// @ts-nocheck
import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Globe, Coins, CheckCircle, HelpCircle, AlertCircle } from 'lucide-react';
import StepsSection from '@/components/marketing/steps-section';
import CTASection from '@/components/marketing/cta-section';

export default function SendMoneyPage() {
  const steps = [
    {
      number: '1',
      title: 'Top Up Your Wallet',
      description: 'Fund your Nyasawallet with local Kwacha instantly using TNM Mpamba, Airtel Money, or local bank transfer.',
    },
    {
      number: '2',
      title: 'Enter Recipient Details',
      description: 'Input your recipient’s phone number, crypto wallet address, or select their country for a direct local mobile money payout.',
    },
    {
      number: '3',
      title: 'Send Instantly',
      description: 'Confirm the transaction. Money is sent across borders instantly in stable USDT, saving you time and exorbitant wire fees.',
    },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1 text-xs font-semibold text-brand-600 ring-1 ring-inset ring-brand-600/10 mb-6">
              Global Cross-Border Remittances
            </span>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
              Send Money Anywhere <br />
              from <span className="bg-gradient-to-r from-brand-600 to-blue-500 bg-clip-text text-transparent">Malawi</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Ditch slow bank transfers and overpriced wire services. Nyasawallet leverages secure USDT blockchain technology to allow you to send money globally from Malawi. Pay in local Kwacha; recipients receive USDT or their own local currencies instantly.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/auth/sign-up"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-md hover:bg-brand-700 transition-all duration-200"
              >
                Send Money Now
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#comparison"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200"
              >
                Compare Providers
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section id="comparison" className="py-16 sm:py-24 bg-slate-50/50 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Why Choose Nyasawallet?
            </h2>
            <p className="mt-4 text-base text-slate-600">
              See how Nyasawallet stacks up against traditional commercial banks and conventional remittance services in Malawi.
            </p>
          </div>

          {/* Table Container with scrollbar wrapper */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[600px] border-collapse text-left text-sm text-slate-600">
              <thead>
                <tr className="bg-slate-50 font-display font-bold text-slate-900 border-b border-slate-200">
                  <th className="px-6 py-4">Feature</th>
                  <th className="px-6 py-4 text-brand-600 bg-brand-50/20">Nyasawallet (USDT)</th>
                  <th className="px-6 py-4">Traditional Banks</th>
                  <th className="px-6 py-4">Western Union</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-6 py-4 font-semibold text-slate-900">Transfer Speed</td>
                  <td className="px-6 py-4 font-bold text-emerald-600 bg-brand-50/10">Instant (&lt; 30 seconds)</td>
                  <td className="px-6 py-4">3 to 5 business days</td>
                  <td className="px-6 py-4">1 to 2 hours (branch-dependent)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-slate-900">Average Fees</td>
                  <td className="px-6 py-4 font-bold text-slate-900 bg-brand-50/10">Flat $1 - $2 equivalent</td>
                  <td className="px-6 py-4">MWK 30,000+ plus SWIFT charges</td>
                  <td className="px-6 py-4">5% to 15% embedded markup</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-slate-900">Liquidity Outlets</td>
                  <td className="px-6 py-4 bg-brand-50/10">Direct to mobile money & local banks</td>
                  <td className="px-6 py-4">Bank accounts only</td>
                  <td className="px-6 py-4">Physical branch cash pick-up</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-slate-900">Convenience</td>
                  <td className="px-6 py-4 bg-brand-50/10">100% digital from your smartphone</td>
                  <td className="px-6 py-4">In-branch forms & long queues</td>
                  <td className="px-6 py-4">Requires visiting physical agent</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-semibold text-slate-900">Exchange Rate Lock</td>
                  <td className="px-6 py-4 font-semibold text-emerald-600 bg-brand-50/10">Guaranteed before sending</td>
                  <td className="px-6 py-4">Variable (determined at receipt)</td>
                  <td className="px-6 py-4">Slippage on exchange rate</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <AlertCircle className="h-4 w-4 text-slate-400" />
            <span>Table statistics represent typical transaction fees and transfer estimates in Malawi as of 2026.</span>
          </div>
        </div>
      </section>

      {/* Steps section */}
      <StepsSection
        subtitle="Quick Transfer"
        title="Three Simple Steps to Send Globally"
        steps={steps}
      />

      {/* Extra informational section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">
                Redefining Remittances for the African Continent
              </h2>
              <p className="text-base text-slate-600 leading-relaxed mb-6">
                Intra-African trade has always been constrained by currency conversion friction and heavy banking walls. By converting Malawian Kwacha into standard, fully-collateralized USDT (digital dollars), you transcend geographical barriers instantly.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Perfect for Businesses</h4>
                    <p className="text-xs text-slate-500 mt-1">Settle invoices instantly with regional cross-border suppliers without expensive bank drafts.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Support Loved Ones</h4>
                    <p className="text-xs text-slate-500 mt-1">Send allowances to students or family members living across Southern or Eastern Africa directly to their wallets.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-8 shadow-inner overflow-hidden">
              <h3 className="font-display font-bold text-slate-900 text-xl mb-4">Transfer Estimate</h3>
              <p className="text-sm text-slate-500 mb-6">Compare sending $500 USD equivalent from Malawi:</p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>Nyasawallet</span>
                    <span className="text-brand-600">$500.00 total payout (Fee: $2.00)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full" style={{ width: '99%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>Western Union</span>
                    <span className="text-slate-500">$455.00 total payout (Fee & Rate Cut: $45.00)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-slate-400 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                    <span>Commercial Banks</span>
                    <span className="text-slate-500">$420.00 total payout (Fee & Intermediary SWIFT: $80.00)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-slate-300 rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        heading="Experience Fast Transfers"
        subtext="Create your account, fund it via mobile money, and start sending USDT globally in seconds."
        buttonText="Send Money Now"
        buttonHref="/auth/sign-up"
        secondaryButtonText="Learn More"
        secondaryButtonHref="#"
      />
    </div>
  );
}
