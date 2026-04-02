import { ArrowDownUp, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ALL_CATEGORIES } from '../../data/constants'
import { useAppStore } from '../../store/useAppStore'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { Button } from '../../components/ui/Button'
import { TransactionTable } from './TransactionTable'
import { filterAndSortTransactions } from './transactionsSelectors'

const PAGE_SIZES = [5, 10, 20, 50] as const

export function TransactionsSection() {
  const role = useAppStore((s) => s.role)
  const transactions = useAppStore((s) => s.transactions)
  const filters = useAppStore((s) => s.filters)
  const setQuery = useAppStore((s) => s.setQuery)
  const setTypeFilter = useAppStore((s) => s.setTypeFilter)
  const setCategoryFilter = useAppStore((s) => s.setCategoryFilter)
  const resetFilters = useAppStore((s) => s.resetFilters)
  const setSort = useAppStore((s) => s.setSort)
  const toggleSortDir = useAppStore((s) => s.toggleSortDir)

  const view = useMemo(() => filterAndSortTransactions(transactions, filters), [transactions, filters])
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(5)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [filters.query, filters.type, filters.category, filters.sortKey, filters.sortDir])

  const totalPages = Math.max(1, Math.ceil(view.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const end = start + pageSize
  const visible = view.slice(start, end)

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200/70 bg-white px-5 pb-4 pt-5 dark:border-slate-800/60 dark:bg-slate-950 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Transactions</div>
            <div className="mt-1 text-xs text-slate-700 dark:text-slate-300">
              Search, filter, and sort • {role === 'admin' ? 'Admin can manage entries' : 'Viewer is read-only'}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
            <Filter className="h-4 w-4" />
            <span className="font-medium text-slate-900 dark:text-slate-50">{view.length}</span>
            <span>results</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="relative md:col-span-5">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={filters.query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder="Search merchant, category, date, amount…"
              className="pl-9"
            />
          </div>

          <div className="md:col-span-3">
            <Select value={filters.type} onChange={(e) => setTypeFilter(e.target.value as any)}>
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
          </div>

          <div className="md:col-span-4">
            <Select value={filters.category} onChange={(e) => setCategoryFilter(e.target.value as any)}>
              <option value="all">All categories</option>
              {ALL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>

          <div className="md:col-span-12 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setSort('date')}>
                Date
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setSort('amount')}>
                Amount
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleSortDir} title="Toggle sort direction">
                <ArrowDownUp className="h-4 w-4" />
                {filters.sortDir.toUpperCase()}
              </Button>
            </div>

            <div className="text-xs text-slate-700 dark:text-slate-300">
              Sorting by <span className="font-medium text-slate-900 dark:text-slate-50">{filters.sortKey}</span>
            </div>
          </div>
        </div>
      </div>

      {view.length === 0 ? (
        <div className="p-5 sm:p-6">
          <EmptyState
            title="No transactions match your filters"
            description="Clear filters or try a different keyword."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  resetFilters()
                  setPage(1)
                }}
              >
                Clear filters
              </Button>
            }
          />
        </div>
      ) : (
        <div>
          <TransactionTable transactions={visible} />

          <div className="flex flex-col gap-3 border-t border-slate-200/70 bg-white px-5 py-4 dark:border-slate-800/60 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-xs text-slate-800 dark:text-slate-300">
                Showing{' '}
                <span className="font-medium text-slate-950 dark:text-slate-50">
                  {view.length === 0 ? 0 : start + 1}–{Math.min(end, view.length)}
                </span>{' '}
                of <span className="font-medium text-slate-950 dark:text-slate-50">{view.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-800 dark:text-slate-300">Rows</span>
                <Select
                  value={String(pageSize)}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value) as any)
                    setPage(1)
                  }}
                  className="h-9 w-[90px]"
                >
                  {PAGE_SIZES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <div className="text-xs text-slate-800 dark:text-slate-300">
                Page <span className="font-medium text-slate-950 dark:text-slate-50">{safePage}</span> / {totalPages}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

