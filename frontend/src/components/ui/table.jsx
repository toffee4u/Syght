import React from 'react';
import { cn } from '../../lib/utils';

export function Table({ className, ...props }) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  );
}

export function TableHeader({ className, ...props }) {
  return <thead className={cn('[&_tr]:border-b border-slate-200/80', className)} {...props} />;
}

export function TableBody({ className, ...props }) {
  return (
    <tbody
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
}

export function TableFooter({ className, ...props }) {
  return (
    <tfoot
      className={cn(
        'border-t border-slate-200 bg-slate-50/50 font-medium [&>tr]:last:border-b-0',
        className
      )}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn(
        'border-b border-slate-100 transition-colors hover:bg-slate-50/80 data-[state=selected]:bg-slate-100',
        className
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }) {
  return (
    <th
      className={cn(
        'h-11 px-4 text-left align-middle font-semibold text-slate-600 [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }) {
  return (
    <td
      className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  );
}

export function TableCaption({ className, ...props }) {
  return (
    <caption
      className={cn('mt-4 text-sm text-slate-500', className)}
      {...props}
    />
  );
}
