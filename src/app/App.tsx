import { useEffect } from 'react'
import { DashboardLayout } from './layout/DashboardLayout'
import { useAppStore } from '../store/useAppStore'

export function App() {
  const theme = useAppStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return <DashboardLayout />
}

