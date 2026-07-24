// @ts-nocheck
import { createAdminClient } from '@/lib/supabase/admin';

export const metadata = { title: 'Wallet Settings — Admin' };

export default async function WalletSettingsPage() {
  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from('wallet_settings')
    .select('*')
    .limit(1)
    .single();

  const s = settings || {};

  const settingsGroups = [
    {
      title: 'Limits',
      icon: '⚖️',
      items: [
        { key: 'min_deposit', label: 'Minimum Deposit (USDT)', value: s.min_deposit || 1 },
        { key: 'min_withdrawal', label: 'Minimum Withdrawal (USDT)', value: s.min_withdrawal || 5 },
        { key: 'max_daily_transfer', label: 'Max Daily Transfer (USDT)', value: s.max_daily_transfer || 10000 },
      ],
    },
    {
      title: 'Fees',
      icon: '💰',
      items: [
        { key: 'deposit_fee', label: 'Deposit Fee (%)', value: s.deposit_fee || 0 },
        { key: 'withdrawal_fee', label: 'Withdrawal Fee (%)', value: s.withdrawal_fee || 1 },
        { key: 'transfer_fee', label: 'Transfer Fee (%)', value: s.transfer_fee || 0.1 },
      ],
    },
    {
      title: 'Referral',
      icon: '🎁',
      items: [
        { key: 'referral_bonus', label: 'Referral Bonus (USDT)', value: s.referral_bonus || 5 },
        { key: 'referral_enabled', label: 'Referral Program', value: s.referral_enabled !== false ? 'Enabled' : 'Disabled' },
      ],
    },
    {
      title: 'General',
      icon: '⚙️',
      items: [
        { key: 'app_name', label: 'App Name', value: s.app_name || 'Nyasawallet' },
        { key: 'support_email', label: 'Support Email', value: s.support_email || 'support@nyasawallet.com' },
        { key: 'maintenance_mode', label: 'Maintenance Mode', value: s.maintenance_mode ? 'On' : 'Off' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">Wallet Settings</h1>
        <p className="text-slate-500 mt-1">Global configuration for the wallet platform</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {settingsGroups.map((group) => (
          <div key={group.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span>{group.icon}</span> {group.title}
            </h3>
            <div className="space-y-3">
              {group.items.map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <span className="text-sm font-semibold text-slate-900">{String(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
