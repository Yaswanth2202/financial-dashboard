import type { Category, SortDir, SortKey, TransactionType } from '../../domain/types'

export type Filters = {
  query: string
  type: TransactionType | 'all'
  category: Category | 'all'
  sortKey: SortKey
  sortDir: SortDir
}

