import type { ReactNode } from 'react'

interface PageHeaderProps {
  title?: string
  tabs?: ReactNode
  actions?: ReactNode
}

export default function PageHeader({ title, tabs, actions }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/20 bg-surface/70 px-container-padding shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-8">
        {title && (
          <span className="rounded-xl bg-[#1e3a6e] px-4 py-1.5 text-headline-md font-extrabold tracking-tight text-white shadow-sm">
            {title}
          </span>
        )}
        {tabs}
      </div>
      {actions && <div className="flex items-center gap-4">{actions}</div>}
    </header>
  )
}
