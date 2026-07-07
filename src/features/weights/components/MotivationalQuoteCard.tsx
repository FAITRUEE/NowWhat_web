interface MotivationalQuoteCardProps {
  quote: string
}

export default function MotivationalQuoteCard({ quote }: MotivationalQuoteCardProps) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-surface-variant/30 p-6">
      <p className="text-body-md italic text-on-surface-variant">{quote}</p>
    </div>
  )
}
