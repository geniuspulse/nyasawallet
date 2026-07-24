import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' | 'danger' | 'pending' | 'neutral' | 'slate';
  pill?: boolean;
}

export function Badge({ className, variant = 'default', pill, ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-brand-100 text-brand-800',
    secondary: 'bg-slate-100 text-slate-800',
    destructive: 'bg-red-100 text-red-800',
    outline: 'text-slate-700 border border-slate-200',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    info: 'bg-blue-100 text-blue-800',
    danger: 'bg-red-100 text-red-800',
    pending: 'bg-amber-100 text-amber-800',
    neutral: 'bg-slate-100 text-slate-700',
    slate: 'bg-slate-100 text-slate-700',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant] || variants.default,
        pill && 'rounded-full px-2 py-0.5',
        className
      )}
      {...props}
    />
  );
}
