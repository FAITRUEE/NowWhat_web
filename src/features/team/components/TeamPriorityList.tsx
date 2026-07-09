import { useState } from 'react'
import Icon from '@/components/ui/Icon'
import { getDDayLabel } from '@/lib/date'
import type { TeamTask } from '@/features/team/api/teamApi'
import { applyManualOrder, sortByPriority } from '@/features/team/lib/board'

interface TeamPriorityListProps {
  tasks: TeamTask[]
  onOpenDetail?: (taskId: number) => void
}

export default function TeamPriorityList({ tasks, onOpenDetail }: TeamPriorityListProps) {
  const [orderIds, setOrderIds] = useState<number[] | null>(null)
  const sorted = applyManualOrder(sortByPriority(tasks), orderIds)

  function moveTask(id: number, direction: 'up' | 'down') {
    const currentIds = sorted.map((task) => task.id)
    const index = currentIds.indexOf(id)
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= currentIds.length) return
    const nextIds = [...currentIds]
    ;[nextIds[index], nextIds[swapIndex]] = [nextIds[swapIndex], nextIds[index]]
    setOrderIds(nextIds)
  }

  if (sorted.length === 0) {
    return (
      <div className="glass-card rounded-[24px] border border-outline-variant/20 p-8 text-center text-body-md text-on-surface-variant">
        표시할 업무가 없습니다.
      </div>
    )
  }

  return (
    <div className="glass-card overflow-hidden rounded-[24px] border border-outline-variant/20">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-outline-variant/20 bg-secondary/5">
            <th className="p-4 text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">순위</th>
            <th className="p-4 text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">업무</th>
            <th className="p-4 text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">담당자</th>
            <th className="p-4 text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">D-Day</th>
            <th className="p-4 text-center text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
              점수
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/10">
          {sorted.map((task, index) => (
            <tr
              key={task.id}
              onClick={() => onOpenDetail?.(task.id)}
              className={`transition-colors hover:bg-white/40 ${onOpenDetail ? 'cursor-pointer' : ''}`}
            >
              <td className="p-4 text-label-md font-bold text-primary" onClick={(event) => event.stopPropagation()}>
                <div className="flex items-center gap-1">
                  <span>{index + 1}순위</span>
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => moveTask(task.id, 'up')}
                      disabled={index === 0}
                      aria-label={`${task.title} 순위 올리기`}
                      className="leading-none text-outline/60 transition-colors hover:text-secondary disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Icon name="keyboard_arrow_up" className="text-base" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveTask(task.id, 'down')}
                      disabled={index === sorted.length - 1}
                      aria-label={`${task.title} 순위 내리기`}
                      className="leading-none text-outline/60 transition-colors hover:text-secondary disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Icon name="keyboard_arrow_down" className="text-base" />
                    </button>
                  </div>
                </div>
              </td>
              <td className="p-4 text-body-md font-bold text-primary">{task.title}</td>
              <td className="p-4 text-label-sm text-on-surface-variant">{task.assigneeEmail}</td>
              <td className="p-4">
                <span className="rounded-full bg-surface-container px-3 py-1 text-label-sm font-bold text-on-surface-variant">
                  {getDDayLabel(task.deadline)}
                </span>
              </td>
              <td className="p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-secondary">
                  <Icon name="bolt" filled className="text-sm" />
                  <span className="text-label-md font-bold">{Math.round(task.score * 100)}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
