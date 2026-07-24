// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { COUNTRIES } from '@/lib/types';
import { Loader2, User, FileText, Gift, ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface OnboardingFormProps {
  user: any;
  initialProfile: any;
}

export function OnboardingForm({ user, initialProfile }: OnboardingFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const referralParam = searchParams.get('ref') || '';

  // Form states
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState(initialProfile?.full_name || '');
  const [phoneNumber, setPhoneNumber] = useState(initialProfile?.phone_number || '');
  const [country, setCountry] = useState(initialProfile?.country || 'MW');
  
  const [idType, setIdType] = useState(initialProfile?.id_type || 'National ID');
  const [idNumber, setIdNumber] = useState(initialProfile?.id_number || '');
  
  const [referralCode, setReferralCode] = useState(initialProfile?.referred_by || referralParam);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync referral code from URL parameter if it changes
  useEffect(() => {
    if (referralParam && !referralCode) {
      setReferralCode(referralParam);
    }
  }, [referralParam]);

  const handleNextStep = () => {
    setError(null);
    if (step === 1) {
      if (!fullName.trim()) {
        setError('Full name is required');
        return;
      }
      if (!phoneNumber.trim()) {
        setError('Phone number is required');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!idNumber.trim()) {
        setError('ID number is required for verification');
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Update the profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone_number: phoneNumber,
          country: country,
          id_type: idType,
          id_number: idNumber,
          referred_by: referralCode ? referralCode.trim() : null,
          kyc_status: 'pending', // Auto-submit for review on completing onboarding
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      // 2. Check if a default wallet is needed or if wallets already exist
      const { data: existingWallets, error: walletQueryError } = await supabase
        .from('wallets')
        .select('id')
        .eq('user_id', user.id);

      if (!walletQueryError && (!existingWallets || existingWallets.length === 0)) {
        // Create a default USDT wallet for the user
        await supabase.from('wallets').insert({
          user_id: user.id,
          type: 'usdt',
          balance: 0.0,
          locked_balance: 0.0,
          currency: 'USDT',
          status: 'active',
        });
      }

      // Redirect home
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving onboarding details.');
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <div className="mx-auto w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Top Banner / Progress Header */}
      <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-6 text-white text-center">
        <h2 className="text-2xl font-extrabold">Welcome to Nyasawallet</h2>
        <p className="text-sm text-blue-100 mt-1">Let&apos;s get your digital asset wallet set up in 3 simple steps.</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-2 relative">
        <div 
          className="bg-amber-400 h-full transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="px-8 pt-6 pb-2 flex justify-between items-center text-xs font-semibold text-gray-500">
        <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-brand-600' : ''}`}>
          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] border ${step > 1 ? 'bg-brand-600 border-brand-600 text-white' : step === 1 ? 'border-brand-600 text-brand-600 ring-2 ring-brand-100' : 'border-gray-300'}`}>
            {step > 1 ? <Check className="h-3.5 w-3.5" /> : '1'}
          </div>
          <span>Personal</span>
        </div>
        <div className="h-[1px] flex-1 bg-gray-200 mx-3" />
        <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-brand-600' : ''}`}>
          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] border ${step > 2 ? 'bg-brand-600 border-brand-600 text-white' : step === 2 ? 'border-brand-600 text-brand-600 ring-2 ring-brand-100' : 'border-gray-300'}`}>
            {step > 2 ? <Check className="h-3.5 w-3.5" /> : '2'}
          </div>
          <span>Verification</span>
        </div>
        <div className="h-[1px] flex-1 bg-gray-200 mx-3" />
        <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-brand-600' : ''}`}>
          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] border ${step === 3 ? 'border-brand-600 text-brand-600 ring-2 ring-brand-100' : 'border-gray-300'}`}>
            3
          </div>
          <span>Referral</span>
        </div>
      </div>

      <div className="p-8">
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <User className="h-5 w-5 text-brand-600" />
                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name (as on your ID)
                </label>
                <input
                  type="text"
                  id="fullName"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Banda"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+265 888 12 34 56"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name} ({c.currency})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 2: ID Verification */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <FileText className="h-5 w-5 text-brand-600" />
                <h3 className="text-lg font-bold text-gray-900">Identity Verification</h3>
              </div>

              <div>
                <label htmlFor="idType" className="block text-sm font-medium text-gray-700">
                  ID Document Type
                </label>
                <select
                  id="idType"
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                >
                  <option value="National ID">National ID</option>
                  <option value="Passport">Passport</option>
                  <option value="Driver License">Driver License</option>
                </select>
              </div>

              <div>
                <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
                  ID Document Number
                </label>
                <input
                  type="text"
                  id="idNumber"
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="Enter document number"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                />
              </div>

              <div className="rounded-lg bg-blue-50 border border-blue-100 p-4 text-xs text-blue-700 flex gap-2">
                <span className="font-bold">Note:</span>
                <span>We are regulated and required to verify your identity to protect your wallet and comply with pan-African fintech rules.</span>
              </div>
            </div>
          )}

          {/* STEP 3: Referral Code */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Gift className="h-5 w-5 text-brand-600" />
                <h3 className="text-lg font-bold text-gray-900">Referral Code (Optional)</h3>
              </div>

              <div>
                <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700">
                  Do you have a referral code?
                </label>
                <input
                  type="text"
                  id="referralCode"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="e.g. NYASA-123"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                />
                <p className="mt-1.5 text-xs text-gray-400">
                  If a friend invited you, enter their code here to earn signup bonus credits.
                </p>
              </div>

              <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center space-y-2">
                <p className="text-sm font-medium text-gray-900">Onboarding Summary</p>
                <p className="text-xs text-gray-500">
                  {fullName} &bull; {phoneNumber} &bull; {COUNTRIES.find(c => c.code === country)?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {idType}: {idNumber}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={loading}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700 transition-colors shadow-sm ml-auto"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-lg bg-brand-600 text-sm font-semibold text-white hover:bg-brand-700 transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ml-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <Check className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
