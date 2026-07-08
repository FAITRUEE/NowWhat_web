import { useState, type FormEvent } from 'react'
import Icon from '@/components/ui/Icon'
import TextField from '@/components/ui/TextField'

interface CreateTeamFormProps {
  onSubmit: (name: string) => void
  isSubmitting?: boolean
}

export default function CreateTeamForm({ onSubmit, isSubmitting }: CreateTeamFormProps) {
  const [name, setName] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (name.trim() === '') return
    onSubmit(name.trim())
    setName('')
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card flex items-end gap-4 rounded-2xl border border-outline-variant/20 p-6">
      <div className="flex-1">
        <TextField
          label="새 팀 이름"
          icon="groups"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="예: 캡스톤 프로젝트팀"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || name.trim() === ''}
        className="flex h-[54px] items-center gap-2 rounded-xl bg-primary px-6 text-label-md font-bold text-on-primary shadow-md transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Icon name="add" />
        팀 만들기
      </button>
    </form>
  )
}
