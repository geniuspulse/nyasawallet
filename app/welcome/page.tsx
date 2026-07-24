import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, Globe, Smartphone, Heart } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen bg-white text-gray-900 overflow-hidden flex flex-col justify-between">
      {/* Subtle Background Blue Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-brand-50/50 blur-3xl" />
        <div className="absolute top-1/2 -left-60 h-[600px] w-[600px] rounded-full bg-blue-50/40 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto max-w-7xl px-6 py-6 flex w-full items-center justify-between">
        {/* Logo */}
        <Link href="/welcome" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white font-extrabold text-xl shadow-md group-hover:bg-brand-700 transition-colors">
            N
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Nyasawallet</span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/sign-up"
            className="rounded-lg bg-brand-50 px-3.5 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-100 transition-all border border-brand-200/50"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Hero */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-6 py-12 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-200/60 px-3.5 py-1 text-xs font-semibold text-brand-700 shadow-sm animate-bounce">
          <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
          🇲🇼 Built for Malawi & Beyond
        </div>

        {/* Heading */}
        <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl leading-tight">
          Your Wallet, <span className="text-brand-600 bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">Your Freedom</span>
        </h1>

        {/* Subtext */}
        <p className="mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl leading-relaxed">
          The ultimate pan-African digital wallet. Instantly buy, sell, deposit, and send USDT. Securely bridge your cash with local mobile money providers at the best exchange rates.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-sm sm:max-w-none">
          <Link
            href="/auth/sign-up"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-700 hover:shadow-brand-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Create Free Account
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/auth/login"
            className="flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-4 text-base font-bold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Sign In
          </Link>
        </div>

        {/* Trust Signals Section */}
        <div className="mt-20 w-full border-t border-gray-100 pt-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-3xl mx-auto">
            {/* Trust signal 1 */}
            <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-50 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-gray-900">Secure & Encrypted</h3>
              <p className="mt-1 text-xs text-gray-500">Bank-grade security and full asset encryption.</p>
            </div>

            {/* Trust signal 2 */}
            <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-50 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-gray-900">Instant Setup</h3>
              <p className="mt-1 text-xs text-gray-500">Go from sign-up to your first transfer in 2 minutes.</p>
            </div>

            {/* Trust signal 3 */}
            <div className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-50 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-gray-900">Malawi Supported</h3>
              <p className="mt-1 text-xs text-gray-500">Native integration with Airtel Money & TNM Mpamba.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-100 py-6 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl w-full mx-auto px-6 gap-2">
        <div className="flex items-center gap-1.5">
          <span>&copy; {new Date().getFullYear()} Nyasawallet. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Made with</span>
          <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          <span>for financial inclusion in Africa.</span>
        </div>
      </footer>
    </div>
  );
}
