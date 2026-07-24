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
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
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
    <nav className="space-y-1 px-3 py-4 flex-1 overflow-y-auto">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={closeSidebar}
            className={cn(
              'group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 gap-3.5',
              isActive
                ? 'bg-brand-50 text-brand-600 shadow-sm shadow-brand-100/50'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            <Icon
              className={cn(
                'h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110',
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
      {/* Mobile Top Header */}
      <div className="md:hidden flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-200">
            <Coins className="h-5 w-5" />
          </div>
          <span className="font-display font-bold text-lg text-slate-900 tracking-tight">
            Nyasawallet
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeSidebar}
          />
          <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-white border-r border-slate-200 shadow-2xl z-50">
            <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 shrink-0">
              <Link href="/" className="flex items-center gap-2" onClick={closeSidebar}>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md">
                  <Coins className="h-5 w-5" />
                </div>
                <span className="font-display font-bold text-lg text-slate-900 tracking-tight">
                  Nyasawallet
                </span>
              </Link>
              <button onClick={closeSidebar} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            {renderNavItems()}
            <div className="p-4 border-t border-slate-100">
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
                <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center text-sm font-semibold text-brand-700">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 truncate">{fullName || userEmail}</p>
                  <p className="text-xs text-slate-500 truncate">{walletBalance.toFixed(2)} USDT</p>
                </div>
              </div>
              <button onClick={handleLogout} className="mt-2 w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-slate-200 shrink-0 z-20">
        <div className="flex h-20 items-center px-6 border-b border-slate-100 gap-2.5 shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-200">
              <Coins className="h-5 w-5" />
            </div>
            <span className="font-display font-bold text-xl text-slate-900 tracking-tight">
              Nyasawallet
            </span>
          </Link>
        </div>
        {renderNavItems()}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center text-sm font-semibold text-brand-700">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800 truncate">{fullName || userEmail}</p>
              <p className="text-xs font-medium text-slate-400 truncate">{walletBalance.toFixed(2)} USDT</p>
            </div>
          </div>
          <button onClick={handleLogout} className="mt-2 w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </div>
    </>
  );
}
