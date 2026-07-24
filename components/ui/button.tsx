import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, fullWidth, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800': variant === 'primary',
            'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300': variant === 'secondary',
            'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100': variant === 'outline',
            'text-slate-700 hover:bg-slate-100 active:bg-slate-200': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 active:bg-red-800': variant === 'danger',
            'bg-gold-500 text-white hover:bg-gold-600 active:bg-gold-600': variant === 'gold',
            'text-brand-600 underline-offset-4 hover:underline': variant === 'link',
          },
          {
            'h-9 px-3 text-sm': size === 'sm',
            'h-11 px-4 text-base': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
            'h-10 w-10 p-0': size === 'icon',
          },
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <svg
            className="mr-2 h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
