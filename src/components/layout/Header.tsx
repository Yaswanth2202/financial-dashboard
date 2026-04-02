import { Download, Moon, Plus, RefreshCcw, Sun } from 'lucide-react'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'
import { useAppStore } from '../../store/useAppStore'
import { exportTransactionsCsv, exportTransactionsJson } from '../../utils/exportData'
import { Badge } from '../ui/Badge'

export function Header() {
  const role = useAppStore((s) => s.role)
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)
  const setRole = useAppStore((s) => s.setRole)
  const openCreateTx = useAppStore((s) => s.openCreateTx)
  const resetData = useAppStore((s) => s.resetData)
  const transactions = useAppStore((s) => s.transactions)

  const isAdmin = role === 'admin'

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/70 backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/60">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-sm" aria-hidden />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">Finance Dashboard</div>
                <Badge className={role === 'admin' ? 'border-emerald-200/70 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200' : ''}>
                  {role === 'admin' ? 'Admin' : 'Viewer'}
                </Badge>
              </div>
              <div className="truncate text-xs text-slate-800 dark:text-slate-300">Frontend-only • Mock data • Role-aware</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <label className="text-xs font-medium text-slate-800 dark:text-slate-300" htmlFor="role">
              Role
            </label>
            <Select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as typeof role)}
              className="w-[140px]"
            >
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </Select>
          </div>

          <Button
            variant="ghost"
            className="w-10 px-0"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {isAdmin ? (
            <>
              <Button variant="secondary" onClick={() => exportTransactionsCsv(transactions)}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">CSV</span>
              </Button>
              <Button variant="secondary" onClick={() => exportTransactionsJson(transactions)}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">JSON</span>
              </Button>
              <Button variant="secondary" onClick={resetData}>
                <RefreshCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
              <Button variant="primary" onClick={openCreateTx}>
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </>
          ) : (
            <Button variant="secondary" disabled title="Switch role to Admin to manage data">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          )}
        </div>
      </div>

      <div className="border-t border-slate-200/60 px-4 py-2 sm:hidden dark:border-slate-800/60">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2">
          <label className="text-xs font-medium text-slate-800 dark:text-slate-300" htmlFor="role-mobile">
            Role
          </label>
          <Select id="role-mobile" value={role} onChange={(e) => setRole(e.target.value as typeof role)} className="max-w-[160px]">
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </Select>
        </div>
      </div>
    </header>
  )
}

