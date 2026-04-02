import type { SelectHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-xl border border-slate-200/80 bg-white px-3 text-sm text-slate-900 shadow-sm transition-colors',
        'hover:border-slate-300 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:border-sky-500 dark:focus:ring-sky-900/60',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}

