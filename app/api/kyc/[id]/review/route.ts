// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { KycStatus, KycSubmission } from '@/lib/types';

// PATCH: Admin review (approve or reject) a KYC submission
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = (await createClient()) as any;
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin privilege
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const isAdmin = (profile as any).role === 'admin' || (profile as any).role === 'super_admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Access denied: Admin role required' }, { status: 403 });
    }

    const body = await request.json();
    const { status, rejection_reason } = body as { status: KycStatus; rejection_reason?: string };

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    if (status !== 'approved' && status !== 'rejected') {
      return NextResponse.json({ error: 'Status must be either approved or rejected' }, { status: 400 });
    }

    if (status === 'rejected' && !rejection_reason?.trim()) {
      return NextResponse.json({ error: 'Rejection reason is required when rejecting a submission' }, { status: 400 });
    }

    // Fetch the KYC submission
    const { data: submission, error: submissionFetchError } = await supabase
      .from('kyc_submissions')
      .select('*')
      .eq('id', params.id)
      .single();

    if (submissionFetchError || !submission) {
      return NextResponse.json({ error: 'KYC submission not found' }, { status: 404 });
    }

    const typedSubmission = submission as KycSubmission;

    // Update KYC submission status and reviewer info
    const { data: updatedSubmission, error: updateSubmissionError } = await supabase
      .from('kyc_submissions')
      .update({
        status,
        rejection_reason: status === 'rejected' ? rejection_reason : null,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateSubmissionError) {
      return NextResponse.json({ error: updateSubmissionError.message }, { status: 500 });
    }

    // Update the profile's KYC status of the user who submitted the document
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({
        kyc_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', typedSubmission.user_id);

    if (profileUpdateError) {
      console.error('Failed to sync profile kyc_status:', profileUpdateError);
      return NextResponse.json({
        message: 'KYC submission reviewed, but failed to update user profile kyc_status.',
        submission: updatedSubmission as KycSubmission,
        profileError: profileUpdateError.message
      }, { status: 200 });
    }

    return NextResponse.json({
      message: `KYC submission successfully ${status}`,
      submission: updatedSubmission as KycSubmission
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
