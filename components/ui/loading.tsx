import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, message, size = 'md', fullPage = false, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-6 w-6 border-2',
      md: 'h-10 w-10 border-3',
      lg: 'h-16 w-16 border-4',
    };

    const containerStyles = fullPage
      ? 'fixed inset-0 bg-slate-50/80 backdrop-blur-xs z-[9999] flex flex-col items-center justify-center'
      : 'flex flex-col items-center justify-center p-8 w-full h-full min-h-[150px]';

    return (
      <div ref={ref} className={cn(containerStyles, className)} {...props}>
        <div className="relative flex items-center justify-center">
          {/* Outer glow spinner */}
          <div
            className={cn(
              "animate-spin rounded-full border-solid border-slate-100 border-t-brand-600 border-r-brand-600/30",
              sizeClasses[size]
            )}
          />
        </div>
        {message && (
          <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-widest animate-pulse select-none">
            {message}
          </p>
        )}
      </div>
    );
  }
);

Loading.displayName = 'Loading';

export { Loading };
