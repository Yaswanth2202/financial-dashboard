import { format, parseISO, startOfMonth } from 'date-fns'
import type { Category, Transaction, TransactionType } from '../domain/types'

export type MonthlyPoint = {
  month: string // e.g. "Mar 2026"
  monthKey: string // yyyy-MM
  income: number
  expense: number
  net: number
}

export function signedAmount(t: Transaction): number {
  return t.type === 'income' ? t.amount : -t.amount
}

export function sumByType(transactions: Transaction[], type: TransactionType): number {
  return transactions.filter((t) => t.type === type).reduce((acc, t) => acc + t.amount, 0)
}

export function totalBalance(transactions: Transaction[]): number {
  return transactions.reduce((acc, t) => acc + signedAmount(t), 0)
}

export function monthlySeries(transactions: Transaction[], months = 6): MonthlyPoint[] {
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date))
  if (sorted.length === 0) return []

  const last = parseISO(sorted[sorted.length - 1]!.date)
  const start = startOfMonth(new Date(last.getFullYear(), last.getMonth() - (months - 1), 1))

  const map = new Map<string, { income: number; expense: number }>()
  for (let i = 0; i < months; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1)
    const key = format(d, 'yyyy-MM')
    map.set(key, { income: 0, expense: 0 })
  }

  for (const t of sorted) {
    const d = parseISO(t.date)
    if (d < start) continue
    const key = format(startOfMonth(d), 'yyyy-MM')
    const cur = map.get(key)
    if (!cur) continue
    if (t.type === 'income') cur.income += t.amount
    else cur.expense += t.amount
  }

  return [...map.entries()].map(([monthKey, v]) => ({
    monthKey,
    month: format(parseISO(`${monthKey}-01`), 'MMM yyyy'),
    income: round2(v.income),
    expense: round2(v.expense),
    net: round2(v.income - v.expense),
  }))
}

export function categoryBreakdown(transactions: Transaction[], type: TransactionType): { category: Category; value: number }[] {
  const map = new Map<Category, number>()
  for (const t of transactions) {
    if (t.type !== type) continue
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
  }
  return [...map.entries()]
    .map(([category, value]) => ({ category, value: round2(value) }))
    .sort((a, b) => b.value - a.value)
}

export function round2(n: number) {
  return Math.round(n * 100) / 100
}

