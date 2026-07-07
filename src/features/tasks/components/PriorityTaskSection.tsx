import type { ReactNode } from 'react'
import Icon from '@/components/ui/Icon'
import TaskRow from '@/features/tasks/components/TaskRow'

export interface PriorityTask {
  id: number
  title: string
  category?: string
  deadline: string
  score: number
  estimatedMinutes: number
}

interface PriorityTaskSectionProps {
  tasks: PriorityTask[]
  onAddClick?: () => void
  tabs?: ReactNode
}

export default function PriorityTaskSection({ tasks, onAddClick, tabs }: PriorityTaskSectionProps) {
  return (
    <section>
      <div className="mb-8 flex items-end justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
            <Icon name="checklist" filled />
          </div>
          <div>
            <h2 className="text-headline-lg text-primary">집중 과제</h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              AI가 계산한 우선순위 점수로 자동 정렬된 목록입니다.
            </p>
            {tabs && <div className="mt-4">{tabs}</div>}
          </div>
        </div>
        <button
          type="button"
          onClick={onAddClick}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-label-md font-bold text-on-primary shadow-md transition-all hover:scale-[1.02] active:scale-95"
        >
          <Icon name="add" />
          할 일 추가
        </button>
      </div>
      <div className="glass-card overflow-hidden rounded-[24px] border border-outline-variant/20">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[10%]" />
            <col className="w-[8%]" />
            <col className="w-[40%]" />
            <col className="w-[14%]" />
            <col className="w-[12%]" />
            <col className="w-[16%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-outline-variant/20 bg-secondary/5">
              <th className="p-4 text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                우선순위
              </th>
              <th className="p-4 text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                상태
              </th>
              <th className="p-4 text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                할 일 제목
              </th>
              <th className="p-4 text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                D-Day
              </th>
              <th className="p-4 text-center text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                점수
              </th>
              <th className="p-4 text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                예상 소요 시간
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {tasks.map((task, index) => (
              <TaskRow key={task.id} rank={index + 1} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
