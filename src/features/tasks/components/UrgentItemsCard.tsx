import Icon from '@/components/ui/Icon'

export interface UrgentItem {
  id: number
  title: string
  timeLabel: string
  critical?: boolean
}

interface UrgentItemsCardProps {
  items: UrgentItem[]
}

export default function UrgentItemsCard({ items }: UrgentItemsCardProps) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[32px] p-8 glass-card">
      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-error/15 blur-3xl transition-colors group-hover:bg-error/25" />
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-error/10 text-error">
          <Icon name="priority_high" filled />
        </div>
        <h4 className="text-headline-md text-primary">긴급 항목</h4>
      </div>
      {items.length === 0 ? (
        <p className="flex flex-1 items-center justify-center text-label-md text-on-surface-variant">
          긴급한 항목이 없어요.
        </p>
      ) : (
        <ul className="flex-1 space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-white/40">
              <div className={`h-2 w-2 rounded-full ${item.critical ? 'bg-error' : 'bg-error/40'}`} />
              <div className="flex-1">
                <p className="text-label-md font-bold text-primary">{item.title}</p>
                <p className="text-label-sm text-on-surface-variant">{item.timeLabel}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
