import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import Icon from '@/components/ui/Icon'
import AddMemberForm from '@/features/team/components/AddMemberForm'
import { teamApi } from '@/features/team/api/teamApi'

export default function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>()
  const id = Number(teamId)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [addMemberError, setAddMemberError] = useState<string | null>(null)

  const teamQuery = useQuery({
    queryKey: ['team', id],
    queryFn: () => teamApi.detail(id),
  })

  const addMemberMutation = useMutation({
    mutationFn: (email: string) => teamApi.addMember(id, email),
    onSuccess: () => {
      setAddMemberError(null)
      queryClient.invalidateQueries({ queryKey: ['team', id] })
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 404) {
        setAddMemberError('가입되지 않은 이메일입니다.')
      } else if (isAxiosError(error) && error.response?.status === 409) {
        setAddMemberError('이미 팀에 속한 사용자입니다.')
      } else {
        setAddMemberError('팀원 추가에 실패했습니다.')
      }
    },
  })

  const team = teamQuery.data

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 space-y-section-gap p-container-padding">
      <section className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
            <Icon name="groups" filled />
          </div>
          <div>
            <h2 className="mb-2 text-headline-lg text-primary">{team?.name ?? '팀'}</h2>
            <p className="text-body-md text-on-surface-variant">멤버 {team?.members.length ?? 0}명</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/teams/${id}/board`)}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-label-md font-bold text-on-primary shadow-md transition-all hover:scale-[1.02] active:scale-95"
        >
          <Icon name="view_kanban" />
          칸반보드 / 팀 우선순위 보기
        </button>
      </section>

      <section className="glass-card space-y-6 rounded-2xl border border-outline-variant/20 p-6">
        <h3 className="text-headline-md text-primary">팀원</h3>
        <ul className="space-y-2">
          {team?.members.map((member) => (
            <li
              key={member.userId}
              className="flex items-center gap-3 rounded-xl bg-surface-container-low/50 px-4 py-3"
            >
              <Icon name="account_circle" className="text-on-surface-variant" />
              <span className="text-body-md text-primary">{member.email}</span>
              {member.userId === team.ownerId && (
                <span className="ml-auto rounded-full bg-secondary/10 px-3 py-1 text-label-sm font-bold text-secondary">
                  팀장
                </span>
              )}
            </li>
          ))}
        </ul>
        <AddMemberForm
          onSubmit={(email) => addMemberMutation.mutate(email)}
          isSubmitting={addMemberMutation.isPending}
          errorMessage={addMemberError}
        />
      </section>
    </div>
  )
}
