import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import Icon from '@/components/ui/Icon'
import KanbanBoard from '@/features/team/components/KanbanBoard'
import TeamPriorityList from '@/features/team/components/TeamPriorityList'
import RoleBundlePool from '@/features/team/components/RoleBundlePool'
import AddTeamTaskModal, { type NewTeamTaskInput } from '@/features/team/components/AddTeamTaskModal'
import InviteMemberModal from '@/features/team/components/InviteMemberModal'
import TeamTaskDetailModal from '@/features/team/components/TeamTaskDetailModal'
import { teamApi } from '@/features/team/api/teamApi'
import { taskApi } from '@/features/tasks/api/taskApi'
import { toEndOfDayIso } from '@/lib/date'
import { getEmailFromToken } from '@/lib/jwt'
import type { TaskInput, TaskStatus } from '@/types/task'

type BoardView = 'kanban' | 'priority'

const VIEW_OPTIONS: { value: BoardView; label: string }[] = [
  { value: 'kanban', label: '칸반형' },
  { value: 'priority', label: '우선순위형' },
]

export default function TeamBoardPage() {
  const { teamId } = useParams<{ teamId: string }>()
  const id = Number(teamId)
  const queryClient = useQueryClient()
  const [view, setView] = useState<BoardView>('kanban')
  const [isAddModalOpen, setAddModalOpen] = useState(false)
  const [isInviteModalOpen, setInviteModalOpen] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const currentUserEmail = getEmailFromToken(localStorage.getItem('accessToken') ?? '')

  const boardQuery = useQuery({
    queryKey: ['team-board', id],
    queryFn: () => teamApi.board(id),
  })

  const bundlesQuery = useQuery({
    queryKey: ['team-bundles', id],
    queryFn: () => teamApi.bundles(id),
  })

  const teamQuery = useQuery({
    queryKey: ['team', id],
    queryFn: () => teamApi.detail(id),
  })

  const statusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: TaskStatus }) => taskApi.updateStatus(taskId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team-board', id] }),
  })

  const organizeMutation = useMutation({
    mutationFn: () => teamApi.organize(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team-bundles', id] }),
  })

  const reassignMutation = useMutation({
    mutationFn: (taskId: number) => taskApi.reassignToMe(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-board', id] })
      queryClient.invalidateQueries({ queryKey: ['team-bundles', id] })
    },
  })

  const reassignToMemberMutation = useMutation({
    mutationFn: ({ taskId, assigneeUserId }: { taskId: number; assigneeUserId: number }) =>
      taskApi.reassign(taskId, assigneeUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-board', id] })
      queryClient.invalidateQueries({ queryKey: ['team-bundles', id] })
    },
  })

  const createMutation = useMutation({
    mutationFn: (input: NewTeamTaskInput) =>
      teamApi.createTask(id, {
        title: input.title,
        description: input.description || undefined,
        deadline: toEndOfDayIso(input.deadline),
        importance: input.importance,
        estimatedMinutes: input.estimatedMinutes,
        assigneeUserId: input.assigneeUserId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-board', id] })
      setAddModalOpen(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ taskId, input }: { taskId: number; input: TaskInput }) => taskApi.update(taskId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-board', id] })
      setSelectedTaskId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (taskId: number) => taskApi.remove(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-board', id] })
      setSelectedTaskId(null)
    },
  })

  const inviteMutation = useMutation({
    mutationFn: (email: string) => teamApi.addMember(id, email),
    onSuccess: () => {
      setInviteError(null)
      setInviteModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['team', id] })
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 404) {
        setInviteError('가입되지 않은 이메일입니다.')
      } else if (isAxiosError(error) && error.response?.status === 409) {
        setInviteError('이미 팀에 속한 사용자입니다.')
      } else {
        setInviteError('팀원 추가에 실패했습니다.')
      }
    },
  })

  const tasks = boardQuery.data ?? []
  const bundles = bundlesQuery.data ?? []
  const members = teamQuery.data?.members ?? []
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? null

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 space-y-section-gap p-container-padding">
      <section>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
              <Icon name="view_kanban" filled />
            </div>
            <div>
              <h2 className="mb-2 text-headline-lg text-primary">{teamQuery.data?.name ?? '팀 보드'}</h2>
              <p className="mb-1 text-body-md text-on-surface-variant">
                칸반형으로 진행 상황을 옮기거나, 우선순위형으로 지금 무엇부터 해야 할지 확인하세요.
              </p>
              <p className="flex items-center gap-1.5 text-label-sm text-on-surface-variant opacity-70">
                <Icon name="groups" className="text-base" />
                멤버 {members.length}명
                {members.length > 0 && ` · ${members.map((member) => member.email.split('@')[0]).join(', ')}`}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setInviteModalOpen(true)}
              className="flex items-center gap-2 whitespace-nowrap rounded-xl border border-outline-variant/30 bg-white px-5 py-2.5 text-label-md font-bold text-primary transition-all hover:bg-surface-container-low active:scale-95"
            >
              <Icon name="person_add" />
              팀원 초대
            </button>
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              disabled={members.length === 0}
              className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-primary px-6 py-2.5 text-label-md font-bold text-on-primary shadow-md transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon name="add" />
              업무 추가
            </button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <nav className="inline-flex rounded-full border border-outline-variant/20 bg-surface-container-high/40 p-1">
            {VIEW_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setView(option.value)}
                className={`rounded-full px-6 py-1.5 text-label-md transition-all ${
                  view === option.value
                    ? 'bg-white font-bold text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {option.label}
              </button>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => organizeMutation.mutate()}
            disabled={organizeMutation.isPending || tasks.length === 0}
            className="flex items-center gap-2 rounded-xl border border-secondary/30 bg-secondary/10 px-5 py-2.5 text-label-md font-bold text-secondary transition-all hover:bg-secondary/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name="auto_awesome" />
            {organizeMutation.isPending ? 'AI가 분배하는 중...' : '역할 추천 분배'}
          </button>
        </div>
      </section>

      <RoleBundlePool
        bundles={bundles}
        onReassign={(taskId) => reassignMutation.mutate(taskId)}
        isReassigning={reassignMutation.isPending}
      />

      {boardQuery.isLoading ? (
        <p className="p-8 text-center text-body-md text-on-surface-variant">불러오는 중...</p>
      ) : view === 'kanban' ? (
        <KanbanBoard
          tasks={tasks}
          onStatusChange={(taskId, status) => statusMutation.mutate({ taskId, status })}
          onOpenDetail={(taskId) => setSelectedTaskId(taskId)}
        />
      ) : (
        <TeamPriorityList tasks={tasks} onOpenDetail={(taskId) => setSelectedTaskId(taskId)} />
      )}

      <AddTeamTaskModal
        open={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={(input) => createMutation.mutate(input)}
        members={members}
      />

      <InviteMemberModal
        open={isInviteModalOpen}
        onClose={() => {
          setInviteModalOpen(false)
          setInviteError(null)
        }}
        onSubmit={(email) => inviteMutation.mutate(email)}
        isSubmitting={inviteMutation.isPending}
        errorMessage={inviteError}
        members={members}
      />

      <TeamTaskDetailModal
        task={selectedTask}
        currentUserEmail={currentUserEmail}
        members={members}
        onClose={() => setSelectedTaskId(null)}
        onUpdate={(taskId, input) => updateMutation.mutate({ taskId, input })}
        onDelete={(taskId) => deleteMutation.mutate(taskId)}
        onReassign={(taskId, assigneeUserId) => reassignToMemberMutation.mutate({ taskId, assigneeUserId })}
        isSaving={updateMutation.isPending}
        isDeleting={deleteMutation.isPending}
        isReassigning={reassignToMemberMutation.isPending}
      />
    </div>
  )
}
