import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'USDT') {
  if (currency === 'USDT' || currency === 'USD') {
    return `$${amount.toFixed(2)}`;
  }
  return `${amount.toLocaleString()} ${currency}`;
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    completed: 'bg-green-100 text-green-700',
    approved: 'bg-green-100 text-green-700',
    active: 'bg-green-100 text-green-700',
    pending: 'bg-amber-100 text-amber-700',
    open: 'bg-blue-100 text-blue-700',
    failed: 'bg-red-100 text-red-700',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-slate-100 text-slate-700',
    frozen: 'bg-amber-100 text-amber-700',
    closed: 'bg-slate-100 text-slate-700',
    resolved: 'bg-green-100 text-green-700',
  };
  return colors[status] || 'bg-slate-100 text-slate-700';
}
