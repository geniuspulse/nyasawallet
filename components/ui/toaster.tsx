'use client';

import * as React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'destructive' | 'warning';
}

type ToastCallback = (toast: Omit<Toast, 'id'>) => void;
let toastCallback: ToastCallback | null = null;

export function toast(props: Omit<Toast, 'id'>) {
  if (toastCallback) {
    toastCallback(props);
  } else {
    console.log('Toast: ', props);
  }
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  React.useEffect(() => {
    toastCallback = (newToast) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { ...newToast, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    };

    return () => {
      toastCallback = null;
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-start gap-3 p-4 rounded-xl border bg-white shadow-lg pointer-events-auto animate-in slide-in-from-bottom-5 duration-200"
          style={{
            borderColor:
              t.variant === 'success'
                ? '#bbf7d0'
                : t.variant === 'destructive'
                ? '#fecaca'
                : t.variant === 'warning'
                ? '#fef08a'
                : '#e2e8f0',
            backgroundColor:
              t.variant === 'success'
                ? '#f0fdf4'
                : t.variant === 'destructive'
                ? '#fef2f2'
                : t.variant === 'warning'
                ? '#fefce8'
                : '#ffffff',
          }}
        >
          <div className="mt-0.5">
            {t.variant === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
            {t.variant === 'destructive' && <AlertCircle className="h-5 w-5 text-red-600" />}
            {t.variant === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
            {t.variant === 'default' && <Info className="h-5 w-5 text-slate-500" />}
          </div>
          <div className="flex-1">
            {t.title && <h5 className="text-sm font-semibold text-slate-900">{t.title}</h5>}
            {t.description && <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>}
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors mt-0.5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
