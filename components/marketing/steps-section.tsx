// @ts-nocheck
import React from 'react';

interface Step {
  number: string;
  title: string;
  description: string;
}

interface StepsSectionProps {
  title?: string;
  subtitle?: string;
  steps?: Step[];
}

const defaultSteps: Step[] = [
  {
    number: '01',
    title: 'Create your account',
    description: 'Sign up for free with your email and phone number. It takes less than a minute — no paperwork, no KYC needed to start.',
  },
  {
    number: '02',
    title: 'Fund your wallet',
    description: 'Deposit USDT from any wallet, or buy USDT directly with mobile money, bank transfer, or card. Get the best rates instantly.',
  },
  {
    number: '03',
    title: 'Send, spend & save',
    description: 'Transfer USDT to anyone, spend with your virtual card, or hold for the best rates. Everything in one app.',
  },
];

export default function StepsSection({ title, subtitle, steps }: StepsSectionProps) {
  const displaySteps = steps || defaultSteps;

  return (
    <section className="py-16 sm:py-24 bg-slate-50/50 border-y border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="mx-auto max-w-2xl text-center mb-16 sm:mb-20">
            {subtitle && (
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 mb-3">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {title}
              </h2>
            )}
          </div>
        )}

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-[43px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200" aria-hidden="true" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative z-10">
            {displaySteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center lg:items-center text-center px-4 group">
                {/* Number Circle with gradient/glow */}
                <div className="relative mb-6">
                  <div className="absolute -inset-2 rounded-full bg-brand-500/15 blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-brand-500 bg-gradient-to-br from-white to-brand-50/50 font-display text-lg font-bold text-brand-600 shadow-md shadow-brand-200/50 group-hover:shadow-lg group-hover:shadow-brand-300/50 transition-all duration-200 group-hover:scale-110">
                    {step.number}
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="font-display text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-base text-slate-600 max-w-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
