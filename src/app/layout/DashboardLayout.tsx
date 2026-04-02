import { Header } from '../../components/layout/Header'
import { DashboardOverview } from '../../features/dashboard/DashboardOverview'
import { TransactionsSection } from '../../features/transactions/TransactionsSection'
import { InsightsSection } from '../../features/insights/InsightsSection'
import { TransactionModal } from '../../features/transactions/TransactionModal'
import { useAppStore } from '../../store/useAppStore'

export function DashboardLayout() {
  const isTxModalOpen = useAppStore((s) => s.ui.isTxModalOpen)

  return (
    <div className="min-h-dvh">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <DashboardOverview />
            <div className="mt-6">
              <TransactionsSection />
            </div>
          </section>

          <aside className="lg:col-span-4">
            <InsightsSection />
          </aside>
        </div>
      </main>

      {isTxModalOpen ? <TransactionModal /> : null}
    </div>
  )
}

