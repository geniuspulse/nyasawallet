// @ts-nocheck
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  ArrowLeftRight,
  TrendingUp,
  CreditCard,
  Settings,
  LifeBuoy,
  LogOut,
  Wallet
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface SidebarNavProps {
  userEmail?: string;
  userRole?: string;
}

export function SidebarNav({ userEmail, userRole }: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const menuItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'KYC Approvals', href: '/admin/kyc', icon: ShieldCheck },
    { name: 'Transactions', href: '/admin/transactions', icon: ArrowLeftRight },
    { name: 'Exchange Rates', href: '/admin/rates', icon: TrendingUp },
    { name: 'Payment Gateways', href: '/admin/gateways', icon: CreditCard },
    { name: 'Wallet Settings', href: '/admin/wallet-settings', icon: Settings },
    { name: 'Support', href: '/admin/support', icon: LifeBuoy },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <div className="flex h-full w-64 flex-col bg-slate-900 text-slate-100 border-r border-slate-800">
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-lg text-indigo-400">
          <Wallet className="h-5 w-5" />
          <span>Nyasa Admin</span>
        </Link>
        <span className="ml-2 rounded bg-brand-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400">
          USDT
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Session Footer */}
      <div className="border-t border-slate-800 p-4">
        {userEmail && (
          <div className="mb-3 px-2">
            <p className="truncate text-xs font-medium text-slate-200">{userEmail}</p>
            <p className="text-[10px] font-medium text-slate-500 uppercase">{userRole}</p>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-medium text-slate-400 hover:bg-red-950/20 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
