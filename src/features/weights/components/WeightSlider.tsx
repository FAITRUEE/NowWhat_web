interface WeightSliderProps {
  label: string
  description: string
  value: number
  onChange: (value: number) => void
}

export default function WeightSlider({ label, description, value, onChange }: WeightSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-label-md font-bold text-primary">{label}</label>
        <span className="rounded-md bg-primary px-2.5 py-1 text-label-sm font-bold text-on-primary">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-outline-variant/30 accent-secondary"
      />
      <p className="text-label-sm leading-relaxed text-on-surface-variant">{description}</p>
    </div>
  )
}
