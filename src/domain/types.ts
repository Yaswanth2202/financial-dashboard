export type Role = 'viewer' | 'admin'

export type TransactionType = 'income' | 'expense'

export type Category =
  | 'Salary'
  | 'Freelance'
  | 'Investments'
  | 'Food & Dining'
  | 'Groceries'
  | 'Rent'
  | 'Utilities'
  | 'Transport'
  | 'Shopping'
  | 'Health'
  | 'Entertainment'
  | 'Travel'
  | 'Subscriptions'
  | 'Education'
  | 'Gifts'
  | 'Misc'

export type Transaction = {
  id: string
  date: string // ISO date (yyyy-MM-dd)
  type: TransactionType
  category: Category
  description: string
  amount: number // positive number; UI decides sign by `type`
}

export type SortKey = 'date' | 'amount'
export type SortDir = 'asc' | 'desc'

