import { cn } from '../../utils/cn'

export function EmptyState({
  title,
  description,
  className,
  action,
}: {
  title: string
  description: string
  className?: string
  action?: React.ReactNode
}) {
  return (
    <div className={cn('rounded-2xl border border-dashed border-slate-200/80 bg-white p-6 text-center shadow-sm dark:border-slate-800/70 dark:bg-slate-900/30', className)}>
      <div className="mx-auto max-w-sm">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">{title}</div>
        <div className="mt-1 text-sm text-slate-800 dark:text-slate-300">{description}</div>
        {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
      </div>
    </div>
  )
}

