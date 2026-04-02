import { useEffect, useId } from 'react'
import { cn } from '../../utils/cn'

type ModalProps = {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  onClose: () => void
}

export function Modal({ title, description, children, footer, onClose }: ModalProps) {
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
    >
      <button
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <div
        className={cn(
          'relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-xl',
          'dark:border-slate-800/60 dark:bg-slate-950',
        )}
      >
        <div className="px-5 pb-3 pt-5 sm:px-6">
          <h2 id={titleId} className="text-base font-semibold text-slate-900 dark:text-slate-50">
            {title}
          </h2>
          {description ? (
            <p id={descId} className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {description}
            </p>
          ) : null}
        </div>

        <div className="px-5 pb-5 sm:px-6">{children}</div>

        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-slate-200/70 bg-slate-50 px-5 py-4 dark:border-slate-800/60 dark:bg-slate-950 sm:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}

