import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import ConfirmModal from '@/components/ui/ConfirmModal'
import AddTaskModal, { type NewTaskInput } from '@/features/tasks/components/AddTaskModal'
import TaskDetailCard from '@/features/tasks/components/TaskDetailCard'
import { taskApi } from '@/features/tasks/api/taskApi'
import { toEndOfDayIso } from '@/lib/date'

interface TaskDetailModalProps {
  taskId: number | null
  onClose: () => void
}

export default function TaskDetailModal({ taskId, onClose }: TaskDetailModalProps) {
  const queryClient = useQueryClient()
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [isCompleteConfirmOpen, setCompleteConfirmOpen] = useState(false)

  const open = taskId != null

  const taskQuery = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => taskApi.get(taskId as number),
    enabled: open,
  })
  const task = taskQuery.data

  const updateMutation = useMutation({
    mutationFn: (input: NewTaskInput) =>
      taskApi.update(taskId as number, {
        title: input.title,
        description: input.description || undefined,
        deadline: toEndOfDayIso(input.deadline),
        importance: input.importance,
        estimatedMinutes: input.estimatedMinutes,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setEditModalOpen(false)
    },
  })

  const completeMutation = useMutation({
    mutationFn: () => taskApi.complete(taskId as number),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['history'] })
      setCompleteConfirmOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => taskApi.remove(taskId as number),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setDeleteConfirmOpen(false)
      onClose()
    },
  })

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-primary/20 p-4 backdrop-blur-2xl"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-on-surface-variant shadow-md transition-colors hover:bg-white"
            aria-label="닫기"
          >
            <Icon name="close" />
          </button>
        </div>

        {taskQuery.isLoading && (
          <p className="glass-card rounded-[24px] p-8 text-center text-body-md text-on-surface-variant">
            불러오는 중...
          </p>
        )}

        {taskQuery.isError && (
          <p className="glass-card rounded-[24px] p-8 text-center text-body-md text-error">
            할 일을 찾을 수 없습니다.
          </p>
        )}

        {task && (
          <TaskDetailCard
            task={task}
            onEditClick={() => setEditModalOpen(true)}
            onDeleteClick={() => setDeleteConfirmOpen(true)}
            onCompleteClick={() => setCompleteConfirmOpen(true)}
            isDeleting={deleteMutation.isPending}
            isCompleting={completeMutation.isPending}
          />
        )}
      </div>

      {task && (
        <AddTaskModal
          open={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSubmit={(input) => updateMutation.mutate(input)}
          editingTask={task}
        />
      )}

      {task && (
        <ConfirmModal
          open={isDeleteConfirmOpen}
          variant="danger"
          title="할 일을 삭제할까요?"
          description={`"${task.title}" 항목을 삭제합니다. 되돌릴 수 없습니다.`}
          confirmLabel="삭제"
          isLoading={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate()}
          onCancel={() => setDeleteConfirmOpen(false)}
        />
      )}

      {task && (
        <ConfirmModal
          open={isCompleteConfirmOpen}
          title="할 일을 완료 처리할까요?"
          description={`"${task.title}" 항목을 완료 처리합니다.`}
          confirmLabel="완료 처리"
          isLoading={completeMutation.isPending}
          onConfirm={() => completeMutation.mutate()}
          onCancel={() => setCompleteConfirmOpen(false)}
        />
      )}
    </div>
  )
}
