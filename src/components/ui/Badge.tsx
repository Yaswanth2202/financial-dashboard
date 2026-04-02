import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        'border-slate-200/80 bg-white text-slate-700 dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-200',
        className,
      )}
      {...props}
    />
  )
}

