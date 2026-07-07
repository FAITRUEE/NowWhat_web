import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <main className="ml-72 flex min-h-screen flex-col">
        <Outlet />
      </main>
    </div>
  )
}
