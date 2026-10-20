import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ className, variant = 'default', ...props }) {
  const variantStyles = {
    default: 'border-transparent bg-slate-900 text-white shadow-xs',
    secondary: 'border-transparent bg-slate-100 text-slate-900',
    destructive: 'border-rose-200/60 bg-rose-50 text-rose-700 font-semibold',
    warning: 'border-amber-200/60 bg-amber-50 text-amber-700 font-semibold',
    success: 'border-emerald-200/60 bg-emerald-50 text-emerald-700 font-semibold',
    outline: 'border-slate-200 text-slate-800',
    info: 'border-sky-200/60 bg-sky-50 text-sky-700 font-semibold',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        variantStyles[variant] || variantStyles.default,
        className
      )}
      {...props}
    />
  );
}
