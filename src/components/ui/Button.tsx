import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white',
  secondary:
    'bg-white text-slate-900 border border-slate-200/80 hover:bg-slate-50 dark:bg-slate-900/50 dark:text-slate-100 dark:border-slate-800/70 dark:hover:bg-slate-900',
  ghost: 'text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900/60',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-400 dark:text-slate-950',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
}

export function Button({
  className,
  variant = 'secondary',
  size = 'md',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
}

