import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    isPositive: boolean;
    label?: string;
  };
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, icon, trend, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "card-hover relative overflow-hidden bg-white border border-slate-200/60 rounded-xl p-4 shadow-sm hover:shadow-md flex flex-col gap-3 group",
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider select-none">
              {label}
            </span>
            <span className="font-display font-bold text-xl text-slate-900 tracking-tight truncate">
              {value}
            </span>
          </div>
          {icon && (
            <div className="h-9 w-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
              {icon}
            </div>
          )}
        </div>

        {trend && (
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-semibold px-1.5 py-0.5 rounded-full",
                trend.isPositive
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3 shrink-0" />
              ) : (
                <TrendingDown className="h-3 w-3 shrink-0" />
              )}
              {trend.value}
            </span>
            {trend.label && (
              <span className="text-slate-400 font-medium truncate select-none">
                {trend.label}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';

export { StatCard };
