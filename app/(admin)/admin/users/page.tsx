// @ts-nocheck
import { createClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/ui/page-header';
import { UsersManager } from '@/components/admin/users-manager';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const supabase = await createClient();

  // Fetch users with their corresponding wallets
  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*, wallets(*)');

      if (error) {
        console.error('Error fetching profiles & wallets:', error);
        return [];
      }

      return profiles || [];
    } catch (e) {
      console.error('Catastrophic failure fetching profiles:', e);
      return [];
    }
  };

  const users = await fetchUsers();

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle="View registered Nyasawallet clients, inspect wallet balances, alter accounts, and change operational status."
      />
      <UsersManager initialUsers={users} />
    </div>
  );
}
