// @ts-nocheck
'use client';

import React from 'react';
import { Zap, Lock, ArrowLeftRight } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Pane - Blue Gradient Split Screen (Hidden on mobile) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-12 text-white lg:flex animate-gradient-shift">
        {/* Animated decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large blurred circles */}
          <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-float" />
          <div className="absolute -bottom-40 right-20 h-96 w-96 rounded-full bg-blue-300/10 blur-3xl animate-float-delayed" />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 grid-pattern opacity-30" />
          {/* Small floating dots */}
          <div className="absolute top-1/3 right-12 h-2 w-2 rounded-full bg-gold-400/60 blur-sm animate-float" />
          <div className="absolute top-2/3 left-8 h-1.5 w-1.5 rounded-full bg-blue-200/60 blur-sm animate-float-delayed" />
        </div>

        {/* Top: Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white font-extrabold text-2xl shadow-lg ring-1 ring-white/20 backdrop-blur-sm">
            N
          </div>
          <span className="text-2xl font-bold tracking-tight">Nyasawallet</span>
        </div>

        {/* Middle: Tagline & Feature List */}
        <div className="relative z-10 my-auto max-w-md space-y-10">
          <div className="space-y-4 animate-slide-up">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
              Your wallet,<br />your freedom.
            </h1>
            <p className="text-lg text-blue-100 leading-relaxed">
              Join the pan-African revolution. Send, receive, and hold USDT with absolute peace of mind.
            </p>
          </div>

          <div className="space-y-6">
            {/* Feature 1 */}
            <div className="flex items-start gap-4 animate-slide-up delay-200">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/20 backdrop-blur-sm">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Instant Transfers</h3>
                <p className="text-sm text-blue-100">Send USDT across Africa in seconds</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4 animate-slide-up delay-300">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/20 backdrop-blur-sm">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Bank-grade Security</h3>
                <p className="text-sm text-blue-100">Your funds are always protected</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4 animate-slide-up delay-500">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/20 backdrop-blur-sm">
                <ArrowLeftRight className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Best Exchange Rates</h3>
                <p className="text-sm text-blue-100">Live rates updated in real time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Copyright / Subtext */}
        <div className="relative z-10 text-sm text-blue-200/80">
          &copy; {new Date().getFullYear()} Nyasawallet. All rights reserved. Built for Malawi &amp; Beyond.
        </div>
      </div>

      {/* Right Pane - Form area */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-12 xl:px-24 mesh-gradient">
        {/* Mobile logo (only visible on mobile) */}
        <div className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-white font-extrabold text-xl shadow-md shadow-brand-500/25">
            N
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900">
            Nyasawallet<span className="text-brand-600">.</span>
          </span>
        </div>
        <div className="mx-auto w-full max-w-md animate-scale-in">
          {children}
        </div>
      </div>
    </div>
  );
}
