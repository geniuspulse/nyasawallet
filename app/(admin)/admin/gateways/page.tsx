// @ts-nocheck
import { createAdminClient } from '@/lib/supabase/admin';

export const metadata = { title: 'Payment Gateways — Admin' };

export default async function AdminGatewaysPage() {
  const supabase = createAdminClient();
  const { data: gateways } = await supabase
    .from('gateway_configs')
    .select('*')
    .order('created_at', { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Payment Gateways</h1>
        <p className="text-slate-500 mt-1">Configure payment providers for deposits and withdrawals</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {gateways?.map((gw: any) => (
          <div key={gw.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center">
                <span className="text-lg font-bold text-brand-600">{gw.provider_name?.[0]?.toUpperCase()}</span>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${gw.environment === 'production' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {gw.environment || 'sandbox'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${gw.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {gw.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{gw.provider_name}</h3>
            <p className="text-sm text-slate-500 mt-1">API Key: {gw.api_key ? '••••' + gw.api_key.slice(-4) : 'Not set'}</p>
            {gw.webhook_url && <p className="text-xs text-slate-400 mt-2">Webhook: {gw.webhook_url}</p>}
          </div>
        ))}
        {(!gateways || gateways.length === 0) && (
          <div className="col-span-full text-center py-12 text-slate-400">
            No payment gateways configured yet.
          </div>
        )}
      </div>
    </div>
  );
}
