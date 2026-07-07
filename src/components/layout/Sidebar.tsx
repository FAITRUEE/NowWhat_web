import { NavLink } from 'react-router-dom'
import Icon from '@/components/ui/Icon'

const NAV_ITEMS = [
  { to: '/', label: '대시보드', icon: 'dashboard' },
  { to: '/history', label: '이력', icon: 'history' },
  { to: '/settings/weights', label: '설정', icon: 'settings' },
] as const

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col gap-gutter border-r border-white/30 bg-surface-container-lowest/80 p-base backdrop-blur-xl">
      <div className="px-4 py-8">
        <img src="/logo.svg" alt="NowWhat" className="h-14 w-auto" />
      </div>
      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-label-md transition-all ${
                isActive
                  ? 'bg-secondary-container font-bold text-on-secondary-container shadow-sm'
                  : 'text-on-surface-variant hover:translate-x-1 hover:bg-surface-container-high/50'
              }`
            }
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-4 p-4">
        <div className="flex items-center gap-3 border-t border-outline-variant/30 px-2 pt-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
            <Icon name="account_circle" />
          </div>
          <div className="flex flex-col">
            <span className="text-label-md font-bold text-primary">사용자</span>
            <span className="text-label-sm text-on-surface-variant opacity-60">Free Account</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
