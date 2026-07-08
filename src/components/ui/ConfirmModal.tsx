import Icon from '@/components/ui/Icon'

interface ConfirmModalProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'danger'
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  variant = 'default',
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null

  const isDanger = variant === 'danger'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 p-4 backdrop-blur-2xl">
      <div className="soft-shadow w-full max-w-md rounded-2xl border border-white/50 bg-white/90 p-8 backdrop-blur-md">
        <div className="mb-6 flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              isDanger ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'
            }`}
          >
            <Icon name={isDanger ? 'warning' : 'help'} filled />
          </div>
          <div>
            <h3 className="text-headline-md text-primary">{title}</h3>
            {description && <p className="mt-2 text-body-md text-on-surface-variant">{description}</p>}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="soft-extrusion flex-1 rounded-xl border border-outline-variant/50 bg-white py-3 font-bold text-primary transition-all hover:bg-surface active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 rounded-xl py-3 font-bold shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
              isDanger ? 'bg-error text-on-error' : 'bg-primary text-on-primary'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
