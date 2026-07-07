import Icon from '@/components/ui/Icon'

interface InsightBannerProps {
  title: string
  description: string
}

export default function InsightBanner({ title, description }: InsightBannerProps) {
  return (
    <section className="glass-card group relative overflow-hidden rounded-[32px] p-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(var(--color-secondary) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-secondary/15 blur-3xl transition-colors group-hover:bg-secondary/25" />
      <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
          <Icon name="celebration" filled className="text-3xl" />
        </div>
        <div>
          <h3 className="mb-2 text-headline-md text-primary">{title}</h3>
          <p className="text-body-md text-on-surface-variant">{description}</p>
        </div>
      </div>
    </section>
  )
}
