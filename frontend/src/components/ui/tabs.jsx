import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../lib/utils';

const TabsContext = createContext({
  value: '',
  onValueChange: () => {},
});

export function Tabs({ defaultValue, value, onValueChange, className, children, ...props }) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeValue = value !== undefined ? value : internalValue;
  const setActiveValue = onValueChange || setInternalValue;

  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: setActiveValue }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }) {
  return (
    <div
      className={cn(
        'inline-flex h-11 items-center justify-center rounded-xl bg-slate-100 p-1 text-slate-500',
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ value, className, children, ...props }) {
  const { value: selectedValue, onValueChange } = useContext(TabsContext);
  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      onClick={() => onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-medium ring-offset-white transition-all focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        isSelected
          ? 'bg-white text-slate-900 shadow-xs font-semibold'
          : 'text-slate-600 hover:text-slate-900',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children, ...props }) {
  const { value: selectedValue } = useContext(TabsContext);
  if (selectedValue !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn('mt-3 ring-offset-white focus-visible:outline-hidden', className)}
      {...props}
    >
      {children}
    </div>
  );
}
