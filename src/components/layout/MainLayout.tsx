import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'

export default function MainLayout() {
  const location = useLocation()

  // 토큰이 없으면 API를 부르기 전에 로그인 화면으로 보낸다 (만료된 토큰은 client.ts의 401 처리가 맡음)
  if (!localStorage.getItem('accessToken')) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <main className="ml-72 flex min-h-screen flex-col">
        <Outlet />
      </main>
    </div>
  )
}
