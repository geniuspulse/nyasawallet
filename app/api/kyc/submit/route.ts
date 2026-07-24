// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { KycSubmission } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      document_type,
      document_number,
      document_front_url,
      document_back_url,
      selfie_url,
      proof_of_address_url,
      country
    } = body;

    // Fetch existing KYC submissions
    const { data: existingKycData, error: kycError } = await (supabase.from('kyc_submissions') as any)
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (kycError) {
      return NextResponse.json({ error: 'Failed to check existing KYC submissions: ' + kycError.message }, { status: 500 });
    }

    const existingKyc = (existingKycData || []) as KycSubmission[];

    // Check if any is already approved or pending
    if (existingKyc && existingKyc.length > 0) {
      const pendingSub = existingKyc.find(k => k.status === 'pending');
      const approvedSub = existingKyc.find(k => k.status === 'approved');

      if (approvedSub) {
        return NextResponse.json({ error: 'KYC is already approved' }, { status: 400 });
      }
      if (pendingSub) {
        return NextResponse.json({ error: 'KYC submission is already pending review' }, { status: 400 });
      }
    }

    // Insert new KYC submission using admin client to allow updates to any related fields
    const adminSupabase = createAdminClient();

    const { data: kycSubmissionData, error: insertError } = await (adminSupabase.from('kyc_submissions') as any)
      .insert({
        user_id: user.id,
        document_type,
        document_number,
        document_front_url,
        document_back_url,
        selfie_url,
        proof_of_address_url,
        country,
        status: 'pending',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: 'Failed to submit KYC: ' + insertError.message }, { status: 500 });
    }

    const kycSubmission = kycSubmissionData as KycSubmission;

    // Update profile status
    const { error: profileError } = await (adminSupabase.from('profiles') as any)
      .update({ kyc_status: 'pending', updated_at: new Date().toISOString() })
      .eq('user_id', user.id);

    if (profileError) {
      // Rollback KYC submission
      await (adminSupabase.from('kyc_submissions') as any).delete().eq('id', kycSubmission.id);
      return NextResponse.json({ error: 'Failed to update profile KYC status: ' + profileError.message }, { status: 500 });
    }

    return NextResponse.json({ kycSubmission }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
