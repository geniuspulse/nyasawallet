'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ArrowDownLeft, ArrowUpRight, Wallet, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const bottomNavItems = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Deposit', href: '/deposit', icon: ArrowDownLeft },
  { name: 'Wallet', href: '/wallet', icon: Wallet },
  { name: 'Send', href: '/send', icon: ArrowUpRight },
  { name: 'Profile', href: '/profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80">
      <div className="flex items-center justify-around px-2 py-1.5 pb-[env(safe-area-inset-bottom)]">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-[56px]',
                isActive ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <Icon className={cn('h-5 w-5 transition-transform', isActive && 'scale-110')} />
              <span className={cn('text-[10px] font-semibold', isActive && 'text-brand-600')}>
                {item.name}
              </span>
              {isActive && (
                <span className="absolute -top-px h-0.5 w-8 rounded-full bg-brand-600" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
