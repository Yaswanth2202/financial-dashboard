import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowDownRight, ArrowUpRight, PiggyBank, Wallet } from 'lucide-react'
import { useMemo } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { formatCompactCurrency, formatCurrency } from '../../utils/format'
import { categoryBreakdown, monthlySeries, round2, sumByType, totalBalance } from '../../utils/finance'
import { MetricCard } from './MetricCard'
import { EmptyState } from '../../components/ui/EmptyState'
import { Button } from '../../components/ui/Button'

const PIE_COLORS = ['#0ea5e9', '#6366f1', '#22c55e', '#f97316', '#e11d48', '#a855f7', '#14b8a6', '#94a3b8']

function MoneyTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-slate-200/70 bg-white px-3 py-2 text-xs shadow-lg dark:border-slate-800/70 dark:bg-slate-950">
      <div className="font-medium text-slate-900 dark:text-slate-50">{label}</div>
      <div className="mt-1 space-y-1 text-slate-800 dark:text-slate-300">
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-6">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
              {p.name ?? p.dataKey}
            </span>
            <span className="font-medium text-slate-900 dark:text-slate-50">{formatCurrency(Number(p.value))}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardOverview() {
  const transactions = useAppStore((s) => s.transactions)
  const theme = useAppStore((s) => s.theme)
  const role = useAppStore((s) => s.role)
  const setRole = useAppStore((s) => s.setRole)
  const openCreateTx = useAppStore((s) => s.openCreateTx)
  const tickFill = theme === 'dark' ? '#cbd5e1' : '#334155'
  const gridStroke = theme === 'dark' ? 'rgba(148,163,184,0.18)' : 'rgba(100,116,139,0.20)'

  const incomeTotal = useMemo(() => sumByType(transactions, 'income'), [transactions])
  const expenseTotal = useMemo(() => sumByType(transactions, 'expense'), [transactions])
  const balance = useMemo(() => totalBalance(transactions), [transactions])
  const savingsRate = useMemo(() => {
    if (incomeTotal <= 0) return 0
    return round2(((incomeTotal - expenseTotal) / incomeTotal) * 100)
  }, [incomeTotal, expenseTotal])

  const monthly = useMemo(() => monthlySeries(transactions, 6), [transactions])
  const balanceTrend = useMemo(() => {
    if (monthly.length === 0) return []
    let running = 0
    return monthly.map((m) => {
      running += m.net
      return { month: m.month, balance: round2(running) }
    })
  }, [monthly])

  const expenseByCategory = useMemo(() => categoryBreakdown(transactions, 'expense').slice(0, 6), [transactions])

  const net = incomeTotal - expenseTotal
  const netLabel = net >= 0 ? 'Net positive' : 'Net negative'

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Balance" value={formatCurrency(balance)} subtext="All-time net from transactions" icon={<Wallet className="h-4 w-4" />} tone="indigo" />
        <MetricCard title="Total Income" value={formatCurrency(incomeTotal)} subtext="Stable baseline + variable gigs" icon={<ArrowUpRight className="h-4 w-4" />} tone="emerald" />
        <MetricCard title="Total Expenses" value={formatCurrency(expenseTotal)} subtext="Recurring + discretionary" icon={<ArrowDownRight className="h-4 w-4" />} tone="rose" />
        <MetricCard title="Savings Rate" value={`${savingsRate.toFixed(1)}%`} subtext={`${netLabel} • ${formatCompactCurrency(Math.abs(net))}`} icon={<PiggyBank className="h-4 w-4" />} tone="sky" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="card xl:col-span-7">
          <div className="flex items-center justify-between px-5 pb-2 pt-5 sm:px-6">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Income vs Expenses</div>
              <div className="mt-1 text-xs text-slate-800 dark:text-slate-300">Last 6 months • Hover for details</div>
            </div>
          </div>
          <div className="h-[280px] px-2 pb-4 sm:px-4">
            {monthly.length === 0 ? (
              <div className="px-3 pb-3">
                <EmptyState title="No chart data yet" description="Add a transaction (Admin role) to populate trends." />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: tickFill }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 12, fill: tickFill }}
                    tickFormatter={(v) => formatCompactCurrency(Number(v))}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<MoneyTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: tickFill as any }} />
                  <Bar dataKey="income" name="Income" fill="#22c55e" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="expense" name="Expenses" fill="#ef4444" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card xl:col-span-5">
          <div className="flex items-center justify-between px-5 pb-2 pt-5 sm:px-6">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Spending Breakdown</div>
              <div className="mt-1 text-xs text-slate-800 dark:text-slate-300">Top categories • Expenses only</div>
            </div>
          </div>
          <div className="h-[280px] px-2 pb-4 sm:px-4">
            {expenseByCategory.length === 0 ? (
              <div className="px-3 pb-3">
                <EmptyState
                  title="No expenses to visualize"
                  description="Add an expense transaction to populate this chart."
                  action={
                    <Button
                      variant="secondary"
                      onClick={() => {
                        if (role !== 'admin') setRole('admin')
                        openCreateTx()
                      }}
                    >
                      Add an expense
                    </Button>
                  }
                />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }: any) => {
                      if (!active || !payload?.length) return null
                      const p = payload[0]
                      return (
                        <div className="rounded-xl border border-slate-200/70 bg-white px-3 py-2 text-xs shadow-lg dark:border-slate-800/70 dark:bg-slate-950">
                          <div className="font-medium text-slate-900 dark:text-slate-50">{p.name}</div>
                          <div className="mt-1 text-slate-800 dark:text-slate-300">{formatCurrency(Number(p.value))}</div>
                        </div>
                      )
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Pie data={expenseByCategory} dataKey="value" nameKey="category" innerRadius={60} outerRadius={95} paddingAngle={4}>
                    {expenseByCategory.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card xl:col-span-12">
          <div className="flex items-center justify-between px-5 pb-2 pt-5 sm:px-6">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Balance Trend</div>
              <div className="mt-1 text-xs text-slate-800 dark:text-slate-300">Net accumulation across months</div>
            </div>
          </div>
          <div className="h-[220px] px-2 pb-4 sm:px-4">
            {balanceTrend.length === 0 ? (
              <div className="px-3 pb-3">
                <EmptyState title="No trend data" description="Add transactions to see balance movement over time." />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={balanceTrend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: tickFill }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 12, fill: tickFill }}
                    tickFormatter={(v) => formatCompactCurrency(Number(v))}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }: any) => {
                      if (!active || !payload?.length) return null
                      const v = payload[0]?.value ?? 0
                      return (
                        <div className="rounded-xl border border-slate-200/70 bg-white px-3 py-2 text-xs shadow-lg dark:border-slate-800/70 dark:bg-slate-950">
                          <div className="font-medium text-slate-900 dark:text-slate-50">{label}</div>
                          <div className="mt-1 text-slate-800 dark:text-slate-300">{formatCurrency(Number(v))}</div>
                        </div>
                      )
                    }}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#6366f1" fill="rgba(99,102,241,0.15)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

