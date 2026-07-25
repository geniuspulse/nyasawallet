// @ts-nocheck
'use client';
export const dynamic = 'force-dynamic';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Loader2, CheckCircle2 } from 'lucide-react';

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const redirectParam = searchParams.get('redirect') || '/onboarding';

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectParam)}`,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // If user is auto-confirmed and session is returned, redirect to onboarding or destination
      if (data?.session) {
        router.push(redirectParam);
        router.refresh();
      } else {
        // If email confirmation is required
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const redirectToUrl = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectParam)}`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectToUrl,
        },
      });

      if (oauthError) {
        throw oauthError;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google sign in');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6 py-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-emerald-50 p-3 text-emerald-600 border border-emerald-200">
            <CheckCircle2 className="h-12 w-12" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            We&apos;ve sent a confirmation link to <span className="font-semibold text-gray-700">{email}</span>. Please click the link in the email to activate your account.
          </p>
        </div>
        <div className="pt-4">
          <Link
            href="/auth/login"
            className="text-sm font-semibold text-brand-600 hover:text-brand-500 transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Create account
        </h2>
        <p className="text-sm text-gray-500">
          Join thousands managing money with Nyasawallet.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
          {error}
        </div>
      )}

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="#EA4335"
            d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.642 1.091 14.974 0 12 0 7.354 0 3.307 2.661 1.353 6.551l3.913 3.214z"
          />
          <path
            fill="#4285F4"
            d="M16.04 15.345c1.15-.895 1.83-2.4 1.83-4.245 0-.486-.041-.954-.122-1.41H12v3.747h4.045c-.177.94-.71 1.735-1.505 2.268l3.51 2.873c2.05-1.89 3.23-4.673 3.23-7.854 0-1.02-.09-2.02-.27-2.99H12V0h12v24l-7.96-6.655z"
            transform="scale(.8333)"
          />
          <path
            fill="#FBBC05"
            d="M5.266 14.235L1.353 17.45A11.942 11.942 0 0 1 0 12c0-1.957.472-3.805 1.308-5.45l3.931 3.22A7.098 7.098 0 0 0 4.909 12c0 .783.128 1.536.357 2.235z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.958-1.08 7.942-2.915l-3.51-2.873c-1.127.755-2.564 1.205-4.432 1.205-3.414 0-6.302-2.31-7.334-5.423l-3.93 3.22C2.69 21.091 6.98 24 12 24z"
          />
        </svg>
        Sign up with Google
      </button>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <span className="relative bg-white px-4 text-xs uppercase tracking-wider text-gray-400">
          or continue with email
        </span>
      </div>

      {/* Email + Password Form */}
      <form onSubmit={handleEmailSignUp} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 placeholder-gray-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 placeholder-gray-400 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-gray-400">Must be at least 6 characters.</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link
          href="/auth/login"
          className="font-semibold text-brand-600 hover:text-brand-500 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <AuthLayout>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
          <p className="text-sm text-gray-500">Loading signup screen...</p>
        </div>
      }>
        <SignUpForm />
      </Suspense>
    </AuthLayout>
  );
}
