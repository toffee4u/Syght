import React from 'react';
import { cn } from '../../lib/utils';

export function Progress({ className, value = 0, max = 100, variant = 'default', ...props }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const barVariants = {
    default: 'bg-slate-900',
    primary: 'bg-sky-600',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
  };

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-slate-100',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'h-full w-full flex-1 transition-all duration-300 ease-in-out',
          barVariants[variant] || barVariants.default
        )}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
}
