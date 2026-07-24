// @ts-nocheck
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  heading: string;
  subtext: string;
  buttonText: string;
  buttonHref: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
}

export default function CTASection({
  heading,
  subtext,
  buttonText,
  buttonHref,
  secondaryButtonText,
  secondaryButtonHref,
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-6 py-12 sm:px-12 sm:py-20 shadow-2xl shadow-brand-500/30 text-center">
          {/* Decorative glowing backdrops */}
          <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -right-1/4 -bottom-1/4 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {heading}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-brand-100 leading-relaxed">
              {subtext}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href={buttonHref}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-brand-700 shadow-md hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200"
              >
                {buttonText}
                <ArrowRight className="h-5 w-5" />
              </Link>

              {secondaryButtonText && secondaryButtonHref && (
                <Link
                  href={secondaryButtonHref}
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-white/20 transition-all duration-200"
                >
                  {secondaryButtonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
