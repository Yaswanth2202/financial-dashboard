import type { Transaction } from '../../domain/types'
import type { Filters } from './types'
import { format, parseISO } from 'date-fns'

export function filterAndSortTransactions(transactions: Transaction[], filters: Filters): Transaction[] {
  const q = filters.query.trim().toLowerCase()
  const filtered = transactions.filter((t) => {
    if (filters.type !== 'all' && t.type !== filters.type) return false
    if (filters.category !== 'all' && t.category !== filters.category) return false
    if (!q) return true

    const dateLabel = format(parseISO(t.date), 'MMM d, yyyy').toLowerCase()
    const amountLabel = String(t.amount).toLowerCase()
    return (
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.type.toLowerCase().includes(q) ||
      t.date.includes(q) ||
      dateLabel.includes(q) ||
      amountLabel.includes(q)
    )
  })

  const dir = filters.sortDir === 'asc' ? 1 : -1
  return filtered.sort((a, b) => {
    if (filters.sortKey === 'amount') return dir * (a.amount - b.amount)
    return dir * a.date.localeCompare(b.date)
  })
}

