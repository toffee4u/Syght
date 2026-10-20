import React from 'react';
import { cn } from '../../lib/utils';

export function Button({
  className,
  variant = 'default',
  size = 'default',
  disabled = false,
  children,
  ...props
}) {
  const variantStyles = {
    default:
      'bg-slate-900 text-white shadow hover:bg-slate-800 active:scale-[0.98]',
    primary:
      'bg-sky-600 text-white shadow-sm hover:bg-sky-700 active:scale-[0.98]',
    destructive:
      'bg-rose-600 text-white shadow-sm hover:bg-rose-700 active:scale-[0.98]',
    outline:
      'border border-slate-200 bg-white text-slate-800 shadow-xs hover:bg-slate-50 hover:text-slate-900',
    secondary:
      'bg-slate-100 text-slate-900 shadow-xs hover:bg-slate-200/80',
    ghost:
      'hover:bg-slate-100 hover:text-slate-900 text-slate-700',
    link:
      'text-sky-600 underline-offset-4 hover:underline p-0 h-auto',
  };

  const sizeStyles = {
    default: 'h-10 px-4 py-2 text-sm',
    sm: 'h-8 rounded-lg px-3 text-xs',
    lg: 'h-11 rounded-xl px-6 text-base',
    icon: 'h-9 w-9 p-0 flex items-center justify-center',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium transition-all duration-150 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        variantStyles[variant] || variantStyles.default,
        sizeStyles[size] || sizeStyles.default,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
