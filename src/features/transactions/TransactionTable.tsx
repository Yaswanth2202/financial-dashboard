import { ChevronRight, Pencil, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { useAppStore } from '../../store/useAppStore'
import type { Transaction } from '../../domain/types'
import { formatCurrency } from '../../utils/format'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

function TypeBadge({ type }: { type: Transaction['type'] }) {
  if (type === 'income') return <Badge className="border-emerald-200/70 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">Income</Badge>
  return <Badge className="border-rose-200/70 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-200">Expense</Badge>
}

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  const role = useAppStore((s) => s.role)
  const openEditTx = useAppStore((s) => s.openEditTx)
  const deleteTransaction = useAppStore((s) => s.deleteTransaction)

  const isAdmin = role === 'admin'

  return (
    <div>
      {/* Mobile: card list (no horizontal scroll) */}
      <div className="sm:hidden">
        <ul className="divide-y divide-slate-200/70 dark:divide-slate-800/60">
          {transactions.map((t) => {
            const signed = t.type === 'income' ? t.amount : -t.amount
            return (
              <li key={t.id} className="px-5 py-4">
                <button
                  className="w-full rounded-2xl text-left transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 dark:hover:bg-slate-900/40 dark:focus-visible:bg-slate-900/40"
                  onClick={() => {
                    if (!isAdmin) return
                    openEditTx(t.id)
                  }}
                  disabled={!isAdmin}
                  aria-label={isAdmin ? 'Open transaction editor' : 'Viewer role cannot edit'}
                >
                  <div className="flex items-start justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">{t.description}</div>
                        {isAdmin ? <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden /> : null}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-800 dark:text-slate-300">
                        <span>{format(new Date(t.date), 'MMM d, yyyy')}</span>
                        <span aria-hidden>•</span>
                        <span>{t.category}</span>
                      </div>
                      <div className="mt-2">
                        <TypeBadge type={t.type} />
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-sm font-semibold">
                        <span className={signed >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}>
                          {signed >= 0 ? '+' : '−'}
                          {formatCurrency(Math.abs(signed))}
                        </span>
                      </div>
                      {isAdmin ? (
                        <div className="mt-2 flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 px-0"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              openEditTx(t.id)
                            }}
                            aria-label="Edit transaction"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 px-0"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              const ok = window.confirm('Delete this transaction?')
                              if (ok) deleteTransaction(t.id)
                            }}
                            aria-label="Delete transaction"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Desktop/tablet: table */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[760px] border-separate border-spacing-0">
          <thead>
            <tr className="text-left text-xs font-semibold text-slate-800 dark:text-slate-300">
              <th className="border-b border-slate-200/70 bg-slate-50 px-5 py-3 dark:border-slate-800/60 dark:bg-slate-950 sm:px-6">Date</th>
              <th className="border-b border-slate-200/70 bg-slate-50 px-5 py-3 dark:border-slate-800/60 dark:bg-slate-950 sm:px-6">Description</th>
              <th className="border-b border-slate-200/70 bg-slate-50 px-5 py-3 dark:border-slate-800/60 dark:bg-slate-950 sm:px-6">Category</th>
              <th className="border-b border-slate-200/70 bg-slate-50 px-5 py-3 dark:border-slate-800/60 dark:bg-slate-950 sm:px-6">Type</th>
              <th className="border-b border-slate-200/70 bg-slate-50 px-5 py-3 text-right dark:border-slate-800/60 dark:bg-slate-950 sm:px-6">Amount</th>
              <th className="border-b border-slate-200/70 bg-slate-50 px-5 py-3 dark:border-slate-800/60 dark:bg-slate-950 sm:px-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => {
              const signed = t.type === 'income' ? t.amount : -t.amount
              return (
                <tr
                  key={t.id}
                  className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-900/30"
                >
                  <td className="border-b border-slate-200/70 px-5 py-3 text-sm text-slate-800 dark:border-slate-800/60 dark:text-slate-200 sm:px-6">
                    {format(new Date(t.date), 'MMM d, yyyy')}
                  </td>
                  <td className="border-b border-slate-200/70 px-5 py-3 text-sm text-slate-950 dark:border-slate-800/60 dark:text-slate-50 sm:px-6">
                    {t.description}
                  </td>
                  <td className="border-b border-slate-200/70 px-5 py-3 text-sm text-slate-800 dark:border-slate-800/60 dark:text-slate-200 sm:px-6">{t.category}</td>
                  <td className="border-b border-slate-200/70 px-5 py-3 text-sm dark:border-slate-800/60 sm:px-6">
                    <TypeBadge type={t.type} />
                  </td>
                  <td className="border-b border-slate-200/70 px-5 py-3 text-right text-sm font-semibold dark:border-slate-800/60 sm:px-6">
                    <span className={signed >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}>
                      {signed >= 0 ? '+' : '−'}
                      {formatCurrency(Math.abs(signed))}
                    </span>
                  </td>
                  <td className="border-b border-slate-200/70 px-5 py-3 dark:border-slate-800/60 sm:px-6">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 px-0"
                        onClick={() => openEditTx(t.id)}
                        disabled={!isAdmin}
                        title={isAdmin ? 'Edit transaction' : 'Viewer role cannot edit'}
                        aria-label="Edit transaction"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 px-0"
                        onClick={() => {
                          if (!isAdmin) return
                          const ok = window.confirm('Delete this transaction?')
                          if (ok) deleteTransaction(t.id)
                        }}
                        disabled={!isAdmin}
                        title={isAdmin ? 'Delete transaction' : 'Viewer role cannot delete'}
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

