import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import CreateTeamForm from '@/features/team/components/CreateTeamForm'
import TeamCard from '@/features/team/components/TeamCard'
import { teamApi } from '@/features/team/api/teamApi'

export default function TeamListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const teamsQuery = useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.list,
  })

  const createMutation = useMutation({
    mutationFn: teamApi.create,
    onSuccess: (team) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      navigate(`/teams/${team.id}/board`)
    },
  })

  const teams = teamsQuery.data ?? []

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 space-y-section-gap p-container-padding">
      <section className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
          <Icon name="groups" filled />
        </div>
        <div>
          <h2 className="mb-2 text-headline-lg text-primary">팀 프로젝트</h2>
          <p className="text-body-md text-on-surface-variant">
            팀을 만들고 역할을 자동 배분한 뒤, 공유 칸반보드에서 함께 진행 상황을 확인하세요.
          </p>
        </div>
      </section>

      <CreateTeamForm onSubmit={(name) => createMutation.mutate(name)} isSubmitting={createMutation.isPending} />

      <section>
        {teamsQuery.isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((key) => (
              <div
                key={key}
                className="glass-card h-[148px] animate-pulse rounded-2xl border border-outline-variant/20 p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-surface-container" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 rounded bg-surface-container" />
                    <div className="h-3 w-16 rounded bg-surface-container" />
                  </div>
                </div>
                <div className="h-3 w-24 rounded bg-surface-container" />
              </div>
            ))}
          </div>
        ) : teams.length === 0 ? (
          <div className="glass-card flex flex-col items-center gap-3 rounded-2xl border border-outline-variant/20 p-12 text-center">
            <Icon name="groups" className="text-4xl text-on-surface-variant opacity-40" />
            <p className="text-body-md text-on-surface-variant">아직 속한 팀이 없습니다.</p>
            <p className="text-label-sm text-on-surface-variant opacity-60">
              위에서 팀을 만들면 여기에 카드로 표시됩니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
