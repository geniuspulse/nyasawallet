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
          "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-2",
          className
        )}
        {...props}
      >
        <div className="flex flex-col gap-0.5 min-w-0">
          <h1 className="section-heading text-xl sm:text-2xl leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 font-medium max-w-2xl leading-snug">
              {subtitle}
            </p>
          )}
        </div>
        
        {action && (
          <div className="flex items-center shrink-0 self-start sm:self-auto">
            {action}
          </div>
        )}
      </div>
    );
  }
);

PageHeader.displayName = 'PageHeader';

export { PageHeader };
