import React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, subtitle, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100 select-none",
          className
        )}
        {...props}
      >
        <div className="flex flex-col gap-1 min-w-0">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        
        {action && (
          <div className="flex items-center shrink-0 self-start sm:self-auto animate-fadeIn">
            {action}
          </div>
        )}
      </div>
    );
  }
);

PageHeader.displayName = 'PageHeader';

export { PageHeader };
