import { useState, type FormEvent } from 'react'
import Icon from '@/components/ui/Icon'
import TextField from '@/components/ui/TextField'

interface AddMemberFormProps {
  onSubmit: (email: string) => void
  isSubmitting?: boolean
  errorMessage?: string | null
}

export default function AddMemberForm({ onSubmit, isSubmitting, errorMessage }: AddMemberFormProps) {
  const [email, setEmail] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (email.trim() === '') return
    onSubmit(email.trim())
    setEmail('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <TextField
            label="이메일로 팀원 추가"
            icon="person_add"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="teammate@example.com"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting || email.trim() === ''}
          className="flex h-[54px] items-center gap-2 rounded-xl border border-secondary/30 bg-secondary/10 px-5 text-label-md font-bold text-secondary transition-all hover:bg-secondary/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Icon name="add" />
          추가
        </button>
      </div>
      {errorMessage && <p className="text-label-sm text-error">{errorMessage}</p>}
    </form>
  )
}
