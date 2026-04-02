import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export function MetricCard({
  title,
  value,
  subtext,
  icon,
  tone = 'slate',
}: {
  title: string
  value: string
  subtext?: string
  icon: ReactNode
  tone?: 'slate' | 'sky' | 'emerald' | 'rose' | 'indigo'
}) {
  const tones: Record<typeof tone, string> = {
    slate: 'from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950',
    sky: 'from-sky-100 to-slate-50 dark:from-sky-900/30 dark:to-slate-950',
    emerald: 'from-emerald-100 to-slate-50 dark:from-emerald-900/25 dark:to-slate-950',
    rose: 'from-rose-100 to-slate-50 dark:from-rose-900/25 dark:to-slate-950',
    indigo: 'from-indigo-100 to-slate-50 dark:from-indigo-900/25 dark:to-slate-950',
  }

  return (
    <div className={cn('card overflow-hidden')}>
      <div className={cn('h-full bg-gradient-to-br p-4', tones[tone])}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">{title}</div>
            <div className="mt-1 truncate text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">{value}</div>
            {subtext ? <div className="mt-1 text-xs text-slate-700 dark:text-slate-300">{subtext}</div> : null}
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white/60 p-2 text-slate-900 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/40 dark:text-slate-50">
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}

