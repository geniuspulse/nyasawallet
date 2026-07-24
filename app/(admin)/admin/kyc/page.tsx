// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/ui/page-header';
import { KycManager } from '@/components/admin/kyc-manager';

export const dynamic = 'force-dynamic';

export default async function AdminKycPage() {
  const supabase = await createClient();

  // Fetch KYC Submissions
  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('kyc_submissions')
        .select('*, profiles!kyc_submissions_user_id_fkey(full_name, email)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching KYC with profile constraint:', error);
        // Fallback simple query
        const { data: rawData } = await supabase
          .from('kyc_submissions')
          .select('*')
          .order('created_at', { ascending: false });

        return rawData || [];
      }

      return data || [];
    } catch (e) {
      console.error('Catastrophic failure fetching KYC submissions:', e);
      return [];
    }
  };

  const submissions = await fetchSubmissions();

  return (
    <div className="space-y-6">
      <PageHeader
        title="KYC Approval Queue"
        subtitle="Verify user identities by inspecting government IDs, selfies, and residential documents."
      />
      <KycManager initialSubmissions={submissions} />
    </div>
  );
}
