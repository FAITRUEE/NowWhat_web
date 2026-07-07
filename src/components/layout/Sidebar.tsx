import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import { getEmailFromToken } from '@/lib/jwt'

const NAV_ITEMS = [
  { to: '/', label: '대시보드', icon: 'dashboard' },
  { to: '/history', label: '이력', icon: 'history' },
  { to: '/calendar', label: '캘린더', icon: 'calendar_today' },
  { to: '/settings/weights', label: '설정', icon: 'settings' },
] as const

export default function Sidebar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    setEmail(token ? getEmailFromToken(token) : null)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  function handleLogout() {
    localStorage.removeItem('accessToken')
    navigate('/login')
  }

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
      <div ref={menuRef} className="relative mt-auto p-4">
        {menuOpen && (
          <div className="absolute inset-x-4 bottom-full mb-2 overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest shadow-lg">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high/50 hover:text-error"
            >
              <Icon name="logout" />
              <span>로그아웃</span>
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex w-full items-center gap-3 rounded-xl border-t border-outline-variant/30 px-2 pt-4 text-left transition-colors hover:bg-surface-container-high/50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
            <Icon name="account_circle" />
          </div>
          <span className="min-w-0 truncate text-label-md font-bold text-primary">{email ?? '사용자'}</span>
        </button>
      </div>
    </aside>
  )
}
