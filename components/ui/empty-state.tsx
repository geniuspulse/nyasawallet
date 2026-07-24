import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon | React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon: Icon, title, description, action, ...props }, ref) => {
    
    // Check if Icon is a lucide component or raw react node
    const isLucideIcon = Icon && typeof Icon === 'function';

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30 max-w-lg mx-auto",
          className
        )}
        {...props}
      >
        {/* Icon container */}
        {Icon && (
          <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-5 shadow-sm">
            {isLucideIcon ? (
              <React.Fragment>
                {React.createElement(Icon as LucideIcon, { className: "h-6 w-6 stroke-[1.5]" })}
              </React.Fragment>
            ) : (
              (Icon as React.ReactNode)
            )}
          </div>
        )}

        <h3 className="font-display font-bold text-lg text-slate-800 leading-tight mb-2 select-none">
          {title}
        </h3>
        
        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 select-none max-w-xs">
          {description}
        </p>

        {action && (
          <div className="animate-fadeIn">
            {action}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export { EmptyState };
