import type { Transaction } from '../domain/types'

function download(filename: string, content: BlobPart, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function exportTransactionsJson(transactions: Transaction[]) {
  download(`transactions_${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(transactions, null, 2), 'application/json')
}

export function exportTransactionsCsv(transactions: Transaction[]) {
  const header = ['id', 'date', 'type', 'category', 'description', 'amount']
  const rows = transactions.map((t) => [
    t.id,
    t.date,
    t.type,
    t.category,
    t.description.replaceAll('"', '""'),
    String(t.amount),
  ])
  const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
  download(`transactions_${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv')
}

