// @ts-nocheck
import { createAdminClient } from '@/lib/supabase/admin';
import { RatesManager } from '@/components/admin/rates-manager';

export const metadata = { title: 'Exchange Rates — Admin' };

export default async function AdminRatesPage() {
  const supabase = createAdminClient();
  const { data: rates } = await supabase
    .from('country_rates')
    .select('*')
    .order('country_code', { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Exchange Rates</h1>
        <p className="text-slate-500 mt-1">Manage country exchange rates</p>
      </div>
      <RatesManager initialRates={rates || []} />
    </div>
  );
}
