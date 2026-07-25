// @ts-nocheck
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

interface FeatureSectionProps {
  badge?: string;
  title: string;
  description: string;
  bullets?: string[];
  ctaText?: string;
  ctaHref?: string;
  reverse?: boolean;
  visual?: React.ReactNode;
}

export default function FeatureSection({
  badge,
  title,
  description,
  bullets,
  ctaText,
  ctaHref,
  reverse = false,
  visual,
}: FeatureSectionProps) {
  return (
    <section className="py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center ${
          reverse ? 'lg:flex-row-reverse' : ''
        }`}>
          {/* Text Content */}
          <div className={`lg:col-span-6 ${reverse ? 'lg:order-last' : ''}`}>
            {badge && (
              <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 ring-1 ring-inset ring-brand-600/10 mb-6">
                {badge}
              </span>
            )}
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6 leading-tight">
              {title}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              {description}
            </p>

            {bullets && bullets.length > 0 && (
              <ul className="space-y-4 mb-8">
                {bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-sm shadow-brand-500/30">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </div>
                    <span className="text-base">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {ctaText && ctaHref && (
              <div className="flex items-center">
                <Link
                  href={ctaHref}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 group transition-colors"
                >
                  {ctaText}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </div>

          {/* Visual Showcase */}
          <div className="lg:col-span-6">
            <div className="relative flex justify-center items-center">
              {/* Decorative backgrounds */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-slate-100/50 to-blue-50/30 [mask-image:radial-gradient(closest-side,white,transparent)]" />
              <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-brand-100/40 blur-3xl animate-float" />
              <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-gold-400/10 blur-3xl animate-float-delayed" />

              <div className="card-hover relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-2 shadow-2xl shadow-slate-200/50 backdrop-blur-md hover:shadow-premium-lg">
                {visual}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
