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
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-brand-500 to-brand-600 p-12 text-white lg:flex">
        {/* Subtle decorative background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-40 right-20 h-96 w-96 rounded-full bg-white blur-3xl" />
        </div>

        {/* Top: Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-extrabold text-2xl shadow-lg border border-blue-400/30">
            N
          </div>
          <span className="text-2xl font-bold tracking-tight">Nyasawallet</span>
        </div>

        {/* Middle: Tagline & Feature List */}
        <div className="relative z-10 my-auto max-w-md space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Your wallet, your freedom.
            </h1>
            <p className="text-lg text-blue-100">
              Join the pan-African revolution. Send, receive, and hold USDT with absolute peace of mind.
            </p>
          </div>

          <div className="space-y-6">
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 ring-4 ring-amber-400/5">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Instant Transfers</h3>
                <p className="text-sm text-blue-100">Send USDT across Africa in seconds</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 ring-4 ring-amber-400/5">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Bank-grade Security</h3>
                <p className="text-sm text-blue-100">Your funds are always protected</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300 ring-4 ring-emerald-400/5">
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
        <div className="relative z-10 text-sm text-blue-200">
          &copy; {new Date().getFullYear()} Nyasawallet. All rights reserved. Built for Malawi & Beyond.
        </div>
      </div>

      {/* Right Pane - Form area */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-12 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
