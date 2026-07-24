// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/ui/page-header';
import { TransactionsManager } from '@/components/admin/transactions-manager';

export const dynamic = 'force-dynamic';

export default async function AdminTransactionsPage() {
  const supabase = await createClient();

  // Fetch transactions with profiles joined
  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*, profiles!transactions_user_id_fkey(full_name, email)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error querying transactions with profile constraint:', error);
        // Fallback simple query
        const { data: rawData } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false });

        return rawData || [];
      }

      return data || [];
    } catch (e) {
      console.error('Catastrophic failure fetching transactions:', e);
      return [];
    }
  };

  const transactions = await fetchTransactions();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaction Ledger"
        subtitle="Inspect system ledger entries, filter financial activity, approve pending local operations, or flag suspicious behaviors."
      />
      <TransactionsManager initialTransactions={transactions} />
    </div>
  );
}
