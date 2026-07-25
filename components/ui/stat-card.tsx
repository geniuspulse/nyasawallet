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
          "card-hover relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-5 shadow-card hover:shadow-card-hover flex flex-col justify-between gap-4 group",
          className
        )}
        {...props}
      >
        {/* Subtle gradient accent top border */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500/0 via-brand-500/40 to-brand-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider select-none">
              {label}
            </span>
            <span className="font-display font-bold text-2xl text-slate-900 tracking-tight truncate mt-1">
              {value}
            </span>
          </div>
          {icon && (
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600 border border-brand-100 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 group-hover:from-brand-100 group-hover:to-brand-200 transition-all duration-200">
              {icon}
            </div>
          )}
        </div>

        {trend && (
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 font-semibold px-2 py-0.5 rounded-full",
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
