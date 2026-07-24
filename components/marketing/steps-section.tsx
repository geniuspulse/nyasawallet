// @ts-nocheck
import React from 'react';

interface Step {
  number: string; // e.g. "01", "1"
  title: string;
  description: string;
}

interface StepsSectionProps {
  title?: string;
  subtitle?: string;
  steps: Step[];
}

export default function StepsSection({ title, subtitle, steps }: StepsSectionProps) {
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
          {/* Connecting line for desktop (absolute, centered behind circles) */}
          <div className="hidden lg:block absolute top-[43px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200" aria-hidden="true" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center lg:items-center text-center px-4">
                {/* Number Circle with modern gradient/glow */}
                <div className="relative mb-6">
                  <div className="absolute -inset-1 rounded-full bg-brand-500/20 blur-md opacity-75" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-brand-500 bg-white font-display text-lg font-bold text-brand-600 shadow-sm">
                    {step.number}
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="font-display text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-base text-slate-600 max-w-sm">
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
