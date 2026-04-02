import { useMemo } from 'react'
import { TrendingDown, TrendingUp, Sparkles, Receipt, BadgePercent } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { formatCurrency } from '../../utils/format'
import { categoryBreakdown, monthlySeries, sumByType } from '../../utils/finance'
import { EmptyState } from '../../components/ui/EmptyState'

function InsightCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string
  value: string
  hint: string
  icon: React.ReactNode
}) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">{title}</div>
          <div className="mt-1 truncate text-base font-semibold text-slate-900 dark:text-slate-50">{value}</div>
          <div className="mt-1 text-xs text-slate-700 dark:text-slate-300">{hint}</div>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-white/60 p-2 text-slate-900 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/40 dark:text-slate-50">
          {icon}
        </div>
      </div>
    </div>
  )
}

export function InsightsSection() {
  const transactions = useAppStore((s) => s.transactions)

  const insights = useMemo(() => {
    if (transactions.length === 0) return []

    const expensesByCat = categoryBreakdown(transactions, 'expense')
    const topCat = expensesByCat[0]

    const monthly = monthlySeries(transactions, 6)
    const topExpenseMonth = [...monthly].sort((a, b) => b.expense - a.expense)[0]

    const totalIncome = sumByType(transactions, 'income')
    const totalExpense = sumByType(transactions, 'expense')
    const burn = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0

    const expenseTx = transactions.filter((t) => t.type === 'expense')
    const topMerchant = (() => {
      const map = new Map<string, number>()
      for (const t of expenseTx) {
        map.set(t.description, (map.get(t.description) ?? 0) + t.amount)
      }
      const best = [...map.entries()].sort((a, b) => b[1] - a[1])[0]
      if (!best) return null
      return { name: best[0], value: best[1] }
    })()

    const lastTwo = monthly.slice(-2)
    const trend = (() => {
      if (lastTwo.length < 2) return null
      const prev = lastTwo[0]!.expense
      const cur = lastTwo[1]!.expense
      if (prev <= 0) return null
      const pct = ((cur - prev) / prev) * 100
      return { pct, cur, prev, label: lastTwo[1]!.month }
    })()

    return [
      topCat
        ? {
            title: 'Highest spending category',
            value: topCat.category,
            hint: `${formatCurrency(topCat.value)} spent so far`,
            icon: <Receipt className="h-4 w-4" />,
          }
        : null,
      topExpenseMonth
        ? {
            title: 'Peak expense month',
            value: topExpenseMonth.month,
            hint: `${formatCurrency(topExpenseMonth.expense)} in expenses`,
            icon: <Sparkles className="h-4 w-4" />,
          }
        : null,
      {
        title: 'Expense-to-income ratio',
        value: `${burn.toFixed(1)}%`,
        hint: 'Lower generally means more saving capacity',
        icon: <BadgePercent className="h-4 w-4" />,
      },
      topMerchant
        ? {
            title: 'Top expense merchant',
            value: topMerchant.name,
            hint: `${formatCurrency(topMerchant.value)} total`,
            icon: <Receipt className="h-4 w-4" />,
          }
        : null,
      trend
        ? {
            title: 'This month’s expense trend',
            value: `${trend.pct >= 0 ? '+' : ''}${trend.pct.toFixed(1)}%`,
            hint: `${formatCurrency(trend.cur)} vs ${formatCurrency(trend.prev)} last month`,
            icon: trend.pct >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />,
          }
        : null,
    ].filter(Boolean) as Array<{ title: string; value: string; hint: string; icon: React.ReactNode }>
  }, [transactions])

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Insights</div>
          <div className="mt-1 text-xs text-slate-700 dark:text-slate-300">Derived from your mock transactions</div>
        </div>
      </div>

      {insights.length === 0 ? (
        <EmptyState title="No insights yet" description="Once transactions exist, this panel will highlight useful trends." />
      ) : (
        <div className="space-y-3">
          {insights.map((i) => (
            <InsightCard key={i.title} title={i.title} value={i.value} hint={i.hint} icon={i.icon} />
          ))}
        </div>
      )}
    </div>
  )
}

