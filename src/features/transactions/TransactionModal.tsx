import { useMemo, useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { ALL_CATEGORIES } from '../../data/constants'
import type { Transaction, TransactionType } from '../../domain/types'
import { createId } from '../../utils/id'
import { useAppStore, selectEditingTransaction } from '../../store/useAppStore'

export function TransactionModal() {
  const role = useAppStore((s) => s.role)
  const close = useAppStore((s) => s.closeTxModal)
  const add = useAppStore((s) => s.addTransaction)
  const update = useAppStore((s) => s.updateTransaction)
  const editing = useAppStore(selectEditingTransaction)

  const isAdmin = role === 'admin'

  const [date, setDate] = useState(editing?.date ?? new Date().toISOString().slice(0, 10))
  const [type, setType] = useState<TransactionType>(editing?.type ?? 'expense')
  const [category, setCategory] = useState(editing?.category ?? ALL_CATEGORIES[0]!)
  const [description, setDescription] = useState(editing?.description ?? '')
  const [amount, setAmount] = useState(String(editing?.amount ?? ''))
  const [error, setError] = useState<string | null>(null)

  const isEditing = Boolean(editing)

  const title = isEditing ? 'Edit transaction' : 'Add transaction'
  const descriptionText = isAdmin
    ? 'Changes are persisted locally (localStorage) — no backend.'
    : 'Viewer role is read-only. Switch to Admin to manage transactions.'

  const canSubmit = useMemo(() => {
    if (!isAdmin) return false
    if (!date) return false
    if (!description.trim()) return false
    const n = Number(amount)
    if (!Number.isFinite(n) || n <= 0) return false
    return true
  }, [isAdmin, date, description, amount])

  const onSubmit = () => {
    setError(null)
    if (!isAdmin) return

    const n = Number(amount)
    if (!Number.isFinite(n) || n <= 0) {
      setError('Amount must be a positive number.')
      return
    }
    if (!description.trim()) {
      setError('Description is required.')
      return
    }

    const tx: Transaction = {
      id: editing?.id ?? createId('t'),
      date,
      type,
      category,
      description: description.trim(),
      amount: Math.round(n * 100) / 100,
    }

    if (editing) update(tx)
    else add(tx)
    close()
  }

  return (
    <Modal
      title={title}
      description={descriptionText}
      onClose={close}
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSubmit} disabled={!canSubmit}>
            {isEditing ? 'Save' : 'Add'}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-slate-700 dark:text-slate-200" htmlFor="tx-date">
            Date
          </label>
          <Input id="tx-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1" />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-700 dark:text-slate-200" htmlFor="tx-type">
            Type
          </label>
          <Select id="tx-type" value={type} onChange={(e) => setType(e.target.value as TransactionType)} className="mt-1">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-200" htmlFor="tx-category">
            Category
          </label>
          <Select id="tx-category" value={category} onChange={(e) => setCategory(e.target.value as any)} className="mt-1">
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-200" htmlFor="tx-desc">
            Description / Merchant
          </label>
          <Input id="tx-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., FreshMart" className="mt-1" />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-200" htmlFor="tx-amount">
            Amount
          </label>
          <Input
            id="tx-amount"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 42.50"
            className="mt-1"
          />
        </div>
      </div>

      {error ? <div className="mt-3 rounded-xl border border-rose-200/70 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-200">{error}</div> : null}

      {!isAdmin ? (
        <div className="mt-3 rounded-xl border border-slate-200/70 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-800/60 dark:bg-slate-900/30 dark:text-slate-200">
          You can still explore filters and insights in Viewer role — switch to Admin to add/edit/delete.
        </div>
      ) : null}
    </Modal>
  )
}

