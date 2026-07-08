import { useEffect, useState, type FormEvent } from 'react'
import Icon from '@/components/ui/Icon'
import type { TeamMember } from '@/features/team/api/teamApi'

interface InviteMemberModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (email: string) => void
  isSubmitting?: boolean
  errorMessage?: string | null
  members: TeamMember[]
}

export default function InviteMemberModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  errorMessage,
  members,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (open) setEmail('')
  }, [open])

  if (!open) return null

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (email.trim() === '') return
    onSubmit(email.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 p-4 backdrop-blur-2xl">
      <form
        onSubmit={handleSubmit}
        className="soft-shadow flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/50 bg-white/80 backdrop-blur-md"
      >
        <div className="flex items-center justify-between border-b border-surface-variant/30 p-8">
          <div>
            <h3 className="text-headline-md text-primary">팀원 초대</h3>
            <p className="text-label-md text-on-surface-variant">가입된 이메일로 팀원을 바로 추가합니다.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-variant/40"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="space-y-4 p-8">
          <div className="space-y-2">
            <label className="text-label-sm uppercase tracking-wider text-on-surface-variant">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="teammate@example.com"
              autoFocus
              className="w-full rounded-xl border border-outline-variant/30 bg-white px-4 py-3 text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/50"
            />
            {errorMessage && <p className="text-label-sm text-error">{errorMessage}</p>}
          </div>

          {members.length > 0 && (
            <div className="space-y-2">
              <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
                현재 팀원 {members.length}명
              </p>
              <ul className="max-h-32 space-y-1 overflow-y-auto">
                {members.map((member) => (
                  <li
                    key={member.userId}
                    className="flex items-center gap-2 rounded-lg bg-surface-container-low/50 px-3 py-2 text-label-md text-primary"
                  >
                    <Icon name="account_circle" className="text-sm text-on-surface-variant" />
                    {member.email}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex gap-4 border-t border-surface-variant/30 bg-surface/30 p-8">
          <button
            type="button"
            onClick={onClose}
            className="soft-extrusion flex-1 rounded-xl border border-outline-variant/50 bg-white py-3 font-bold text-primary transition-all hover:bg-surface active:scale-[0.98]"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting || email.trim() === ''}
            className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-primary py-3 font-bold text-white shadow-lg transition-all hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name="person_add" />
            {isSubmitting ? '추가하는 중...' : '초대하기'}
          </button>
        </div>
      </form>
    </div>
  )
}
