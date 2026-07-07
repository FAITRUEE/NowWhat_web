import type { InputHTMLAttributes, ReactNode } from 'react'
import Icon from '@/components/ui/Icon'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: string
  rightSlot?: ReactNode
}

export default function TextField({ label, icon, rightSlot, id, className, ...inputProps }: TextFieldProps) {
  return (
    <div className="space-y-2.5">
      {label && (
        <label htmlFor={id} className="flex items-center gap-2 text-label-md text-on-surface-variant">
          {icon && <Icon name={icon} className="text-[18px]" />}
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          className={`h-[54px] w-full rounded-xl border border-outline-variant/40 bg-white/60 px-5 text-body-md text-primary placeholder:text-outline/40 transition-colors focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 ${rightSlot ? 'pr-12' : ''} ${className ?? ''}`}
          {...inputProps}
        />
        {rightSlot && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightSlot}</div>}
      </div>
    </div>
  )
}
