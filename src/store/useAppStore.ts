import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role, SortKey, Transaction } from '../domain/types'
import { seedTransactions } from '../data/seedTransactions'
import type { Filters } from '../features/transactions/types'

type Theme = 'light' | 'dark'

type AppState = {
  role: Role
  theme: Theme
  transactions: Transaction[]
  filters: Filters
  ui: {
    isTxModalOpen: boolean
    editingTxId: string | null
  }

  setRole: (role: Role) => void
  setTheme: (theme: Theme) => void
  resetData: () => void

  setQuery: (query: string) => void
  setTypeFilter: (type: Filters['type']) => void
  setCategoryFilter: (category: Filters['category']) => void
  resetFilters: () => void
  setSort: (sortKey: SortKey) => void
  toggleSortDir: () => void

  openCreateTx: () => void
  openEditTx: (id: string) => void
  closeTxModal: () => void

  addTransaction: (tx: Transaction) => void
  updateTransaction: (tx: Transaction) => void
  deleteTransaction: (id: string) => void
}

const DEFAULT_FILTERS: Filters = {
  query: '',
  type: 'all',
  category: 'all',
  sortKey: 'date',
  sortDir: 'desc',
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      role: 'viewer',
      theme: 'light',
      transactions: seedTransactions,
      filters: DEFAULT_FILTERS,
      ui: {
        isTxModalOpen: false,
        editingTxId: null,
      },

      setRole: (role) => set({ role }),
      setTheme: (theme) => set({ theme }),
      resetData: () =>
        set({
          transactions: seedTransactions,
          filters: DEFAULT_FILTERS,
          ui: { isTxModalOpen: false, editingTxId: null },
        }),

      setQuery: (query) => set((s) => ({ filters: { ...s.filters, query } })),
      setTypeFilter: (type) => set((s) => ({ filters: { ...s.filters, type } })),
      setCategoryFilter: (category) => set((s) => ({ filters: { ...s.filters, category } })),
      resetFilters: () => set({ filters: DEFAULT_FILTERS }),
      setSort: (sortKey) =>
        set((s) => ({
          filters: {
            ...s.filters,
            sortKey,
            sortDir: s.filters.sortKey === sortKey ? s.filters.sortDir : 'desc',
          },
        })),
      toggleSortDir: () =>
        set((s) => ({
          filters: { ...s.filters, sortDir: s.filters.sortDir === 'asc' ? 'desc' : 'asc' },
        })),

      openCreateTx: () => set((s) => ({ ui: { ...s.ui, isTxModalOpen: true, editingTxId: null } })),
      openEditTx: (id) => set((s) => ({ ui: { ...s.ui, isTxModalOpen: true, editingTxId: id } })),
      closeTxModal: () => set((s) => ({ ui: { ...s.ui, isTxModalOpen: false, editingTxId: null } })),

      addTransaction: (tx) => set((s) => ({ transactions: [tx, ...s.transactions] })),
      updateTransaction: (tx) =>
        set((s) => ({ transactions: s.transactions.map((t) => (t.id === tx.id ? tx : t)) })),
      deleteTransaction: (id) => set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) })),
    }),
    {
      name: 'finance-dashboard:v1',
      partialize: (state) => ({ role: state.role, theme: state.theme, transactions: state.transactions }),
    },
  ),
)

export function selectEditingTransaction(state: AppState): Transaction | null {
  const id = state.ui.editingTxId
  if (!id) return null
  return state.transactions.find((t) => t.id === id) ?? null
}

