import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import { teamApi, type Team } from '@/features/team/api/teamApi'
import { getDDayLabel, isUrgentDeadline } from '@/lib/date'

interface TeamCardProps {
  team: Team
}

export default function TeamCard({ team }: TeamCardProps) {
  const navigate = useNavigate()

  const boardQuery = useQuery({
    queryKey: ['team-board', team.id],
    queryFn: () => teamApi.board(team.id),
    staleTime: 60_000,
  })

  const topTask = boardQuery.data?.find((task) => task.status !== 'DONE')

  return (
    <button
      type="button"
      onClick={() => navigate(`/teams/${team.id}/board`)}
      className="glass-card group flex h-full flex-col rounded-2xl border border-outline-variant/20 p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
            <Icon name="groups" filled />
          </div>
          <div>
            <p className="text-body-md font-bold text-primary">{team.name}</p>
            <p className="text-label-sm text-on-surface-variant opacity-70">멤버 {team.members.length}명</p>
          </div>
        </div>
        <Icon
          name="chevron_right"
          className="mt-2 shrink-0 text-on-surface-variant transition-transform group-hover:translate-x-0.5"
        />
      </div>

      <div className="mt-auto border-t border-outline-variant/10 pt-4">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant opacity-60">
          현재 최우선 업무
        </p>
        {boardQuery.isLoading ? (
          <div className="h-5 w-3/4 animate-pulse rounded bg-surface-container" />
        ) : topTask ? (
          <div className="flex items-center gap-2">
            <Icon name="bolt" filled className="shrink-0 text-sm text-secondary" />
            <span className="truncate text-label-md font-semibold text-primary">{topTask.title}</span>
            <span
              className={`ml-auto shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                isUrgentDeadline(topTask.deadline)
                  ? 'bg-error-container/50 text-error'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {getDDayLabel(topTask.deadline)}
            </span>
          </div>
        ) : (
          <p className="text-label-sm text-on-surface-variant opacity-60">등록된 업무가 없습니다</p>
        )}
      </div>
    </button>
  )
}
