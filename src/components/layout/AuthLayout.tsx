import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface p-gutter">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="floating-shape -left-20 -top-20 h-96 w-96 bg-secondary" />
        <div
          className="floating-shape -bottom-32 -right-32 h-[500px] w-[500px] bg-primary"
          style={{ animationDelay: '-5s' }}
        />
      </div>
      <main className="relative z-10 w-full max-w-[460px]">
        <div className="mb-10 flex justify-center px-4">
          <img src="/logo.svg" alt="NowWhat" className="h-20 w-auto" />
        </div>
        <div className="glass-card rounded-[32px] p-10 md:p-14">{children}</div>
        <p className="mt-10 text-center text-label-sm tracking-wider text-on-surface-variant/50">
          © 2026 NowWhat. 모든 권리 보유.
        </p>
      </main>
    </div>
  )
}
