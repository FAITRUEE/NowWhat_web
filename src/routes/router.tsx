import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import DashboardPage from '@/pages/DashboardPage'
import HistoryPage from '@/pages/HistoryPage'
import CalendarPage from '@/pages/CalendarPage'
import WeightSettingsPage from '@/pages/WeightSettingsPage'
import TaskDetailPage from '@/pages/TaskDetailPage'
import TeamListPage from '@/pages/TeamListPage'
import TeamDetailPage from '@/pages/TeamDetailPage'
import TeamBoardPage from '@/pages/TeamBoardPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'tasks/:id', element: <TaskDetailPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'teams', element: <TeamListPage /> },
      { path: 'teams/:teamId', element: <TeamDetailPage /> },
      { path: 'teams/:teamId/board', element: <TeamBoardPage /> },
      { path: 'settings/weights', element: <WeightSettingsPage /> },
    ],
  },
])
