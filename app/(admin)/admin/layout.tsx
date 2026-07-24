// @ts-nocheck
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SidebarNav } from '@/components/admin/sidebar-nav';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/login');
  }

  // Get current user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, email')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile) {
    redirect('/');
  }

  const isAuthorized = (profile as any).role === 'admin' || (profile as any).role === 'super_admin';

  if (!isAuthorized) {
    redirect('/');
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Admin Sidebar */}
      <SidebarNav userEmail={(profile as any).email || user.email} userRole={(profile as any).role} />

      {/* Main Admin Content Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Placeholder (can show admin page titles/actions) */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8 dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Admin Portal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center rounded-full bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-700/10 dark:bg-indigo-450/10 dark:text-indigo-400">
              {(profile as any).role === 'super_admin' ? 'Super Admin' : 'Admin'}
            </span>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-8 focus:outline-none">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
