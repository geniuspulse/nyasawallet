import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Check, Clock, X } from 'lucide-react';
import { cn, formatDate, formatCurrency } from '@/lib/utils';
import { Badge } from './badge';

export interface TransactionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'incoming' | 'outgoing' | 'deposit' | 'withdrawal' | 'send' | 'sell';
  amount: number;
  currency?: string;
  status: 'completed' | 'pending' | 'failed' | 'approved' | 'rejected' | 'cancelled';
  date: string | Date;
  title?: string;
  description?: string;
}

const TransactionItem = React.forwardRef<HTMLDivElement, TransactionItemProps>(
  ({ className, type, amount, currency = 'USDT', status, date, title, description, ...props }, ref) => {
    
    // Determine direction and visual style
    const isIncoming = type === 'incoming' || type === 'deposit';
    
    // Auto titles based on type if not explicitly passed
    const defaultTitle = (() => {
      switch (type) {
        case 'incoming':
          return 'Received USDT';
        case 'deposit':
          return 'Deposited USDT';
        case 'outgoing':
          return 'Sent USDT';
        case 'withdrawal':
          return 'Withdrawn USDT';
        case 'send':
          return 'Transfer Sent';
        case 'sell':
          return 'Sold USDT';
        default:
          return 'Transaction';
      }
    })();

    // Status map to our Badge component variant
    const statusVariantMap = {
      completed: 'success' as const,
      approved: 'success' as const,
      pending: 'pending' as const,
      failed: 'destructive' as const,
      rejected: 'destructive' as const,
      cancelled: 'slate' as const,
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/50 transition-all duration-200 shadow-sm",
          className
        )}
        {...props}
      >
        {/* Left: Icon and Details */}
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Icon Circle */}
          <div
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center shrink-0 border",
              isIncoming
                ? "bg-green-50 text-green-700 border-green-100/60"
                : "bg-slate-50 text-slate-700 border-slate-100"
            )}
          >
            {isIncoming ? (
              <ArrowDownLeft className="h-5 w-5 stroke-[2.5]" />
            ) : (
              <ArrowUpRight className="h-5 w-5 stroke-[2.5]" />
            )}
          </div>

          {/* Details text */}
          <div className="min-w-0 flex flex-col gap-0.5">
            <h4 className="text-sm font-bold text-slate-800 truncate">
              {title || defaultTitle}
            </h4>
            {description && (
              <p className="text-xs text-slate-400 truncate leading-none">
                {description}
              </p>
            )}
            <p className="text-[10px] text-slate-400 font-medium leading-normal">
              {typeof date === 'string' ? date : formatDate(date)}
            </p>
          </div>
        </div>

        {/* Right: Amount and Status */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span
            className={cn(
              "font-display font-bold text-sm tracking-tight",
              isIncoming ? "text-green-600" : "text-slate-800"
            )}
          >
            {isIncoming ? '+' : '-'} {formatCurrency(amount, currency)}
          </span>
          <Badge variant={statusVariantMap[status] || 'slate'} pill className="text-[10px] py-0 px-2 font-bold uppercase tracking-wider">
            {status}
          </Badge>
        </div>
      </div>
    );
  }
);

TransactionItem.displayName = 'TransactionItem';

export { TransactionItem };
