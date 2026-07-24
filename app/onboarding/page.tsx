import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { OnboardingForm } from '@/components/auth/onboarding-form';
import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/onboarding');
  }

  // Fetch current user's profile to see if it exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  // If user has already completed basic onboarding (full_name and phone_number exist), 
  // we might want to redirect them to '/' (dashboard), but let's let them complete it if they are here.

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
          <p className="text-sm text-gray-500">Loading your profile information...</p>
        </div>
      }>
        <OnboardingForm user={user} initialProfile={profile} />
      </Suspense>
    </div>
  );
}
