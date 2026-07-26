'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  History,
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  CreditCard,
  Users,
  LifeBuoy,
  User,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export interface SidebarProps {
  userEmail?: string;
  fullName?: string;
  walletBalance?: number;
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Wallet', href: '/wallet', icon: Wallet },
  { name: 'Transactions', href: '/transactions', icon: History },
  { name: 'Deposit', href: '/deposit', icon: ArrowDownLeft },
  { name: 'Send', href: '/send', icon: ArrowUpRight },
  { name: 'Sell USDT', href: '/sell', icon: Coins },
  { name: 'Virtual Card', href: '/card', icon: CreditCard },
  { name: 'Referrals', href: '/referrals', icon: Users },
  { name: 'Support', href: '/support', icon: LifeBuoy },
  { name: 'Profile', href: '/profile', icon: User },
];

export function Sidebar({ userEmail = '', fullName = '', walletBalance = 0 }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const initials = fullName
    ? fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const renderNavItems = () => (
    <nav className="space-y-0.5 px-3 py-4 flex-1 overflow-y-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={closeSidebar}
            className={cn(
              'group flex items-center px-3.5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-150 gap-3 relative',
              isActive
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            <Icon
              className={cn(
                'h-[18px] w-[18px] shrink-0 transition-transform duration-150',
                isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
              )}
            />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Top Header — full width, above main content */}
      <header className="md:hidden sticky top-0 z-30 h-14 flex items-center justify-between border-b border-slate-200 bg-white/90 backdrop-blur-md px-4"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-sm">
            <Coins className="h-4 w-4" />
          </div>
          <span className="font-display font-bold text-base text-slate-900 tracking-tight">
            Nyasawallet
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
            onClick={closeSidebar}
          />
          <div className="fixed inset-y-0 left-0 flex w-72 max-w-[80vw] flex-col bg-white border-r border-slate-200 shadow-2xl animate-slide-in"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
          >
            <div className="flex h-14 items-center justify-between px-5 border-b border-slate-100 shrink-0">
              <Link href="/dashboard" className="flex items-center gap-2" onClick={closeSidebar}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-sm">
                  <Coins className="h-4 w-4" />
                </div>
                <span className="font-display font-bold text-base text-slate-900 tracking-tight">
                  Nyasawallet
                </span>
              </Link>
              <button onClick={closeSidebar} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            {renderNavItems()}
            <div className="p-3 border-t border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xs font-semibold text-white">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 truncate">{fullName || userEmail}</p>
                  <p className="text-xs text-slate-500 truncate">{walletBalance.toFixed(2)} USDT</p>
                </div>
              </div>
              <button onClick={handleLogout} className="mt-1.5 w-full flex items-center gap-2 px-3 py-2.5 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors min-h-[40px]">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-slate-200 shrink-0 z-20">
        <div className="flex h-16 items-center px-5 border-b border-slate-100 gap-2.5 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 text-white shadow-sm group-hover:shadow-md transition-shadow">
              <Coins className="h-5 w-5" />
            </div>
            <span className="font-display font-bold text-lg text-slate-900 tracking-tight">
              Nyasawallet
            </span>
          </Link>
        </div>
        {renderNavItems()}
        <div className="p-3 border-t border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 transition-all duration-150">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-xs font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800 truncate">{fullName || userEmail}</p>
              <p className="text-xs font-medium text-slate-400 truncate">{walletBalance.toFixed(2)} USDT</p>
            </div>
          </div>
          <button onClick={handleLogout} className="mt-1.5 w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
