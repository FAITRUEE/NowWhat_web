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
  reason?: string
}

const RERANK_LIMIT_OPTIONS = [3, 5, 10, 15, 20]

interface PriorityTaskSectionProps {
  tasks: PriorityTask[]
  onAddClick?: () => void
  onCompleteTask?: (id: number) => void
  onRerankClick?: () => void
  isReranking?: boolean
  rerankLimit?: number
  onRerankLimitChange?: (limit: number) => void
  onMoveTaskUp?: (id: number) => void
  onMoveTaskDown?: (id: number) => void
  tabs?: ReactNode
  isLoading?: boolean
  error?: string | null
}

export default function PriorityTaskSection({
  tasks,
  onAddClick,
  onCompleteTask,
  onRerankClick,
  isReranking,
  rerankLimit,
  onRerankLimitChange,
  onMoveTaskUp,
  onMoveTaskDown,
  tabs,
  isLoading,
  error,
}: PriorityTaskSectionProps) {
  return (
    <section>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
              <Icon name="checklist" filled />
            </div>
            <div>
              <h2 className="text-headline-lg text-primary">집중 과제</h2>
              <p className="mt-2 text-body-md text-on-surface-variant">
                AI가 계산한 우선순위 점수로 자동 정렬된 목록입니다.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={rerankLimit ?? RERANK_LIMIT_OPTIONS[0]}
              onChange={(event) => onRerankLimitChange?.(Number(event.target.value))}
              disabled={isReranking}
              aria-label="AI 재정렬 대상 개수"
              className="rounded-xl border border-outline-variant/30 bg-white px-3 py-2.5 text-label-md text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-secondary/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {RERANK_LIMIT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  상위 {option}개
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onRerankClick}
              disabled={isReranking}
              className="flex items-center gap-2 rounded-xl border border-secondary/30 bg-secondary/10 px-5 py-2.5 text-label-md font-bold text-secondary transition-all hover:scale-[1.02] hover:bg-secondary/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              <Icon name="auto_awesome" />
              {isReranking ? 'AI 재정렬 중...' : 'AI 재정렬'}
            </button>
            <button
              type="button"
              onClick={onAddClick}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-label-md font-bold text-on-primary shadow-md transition-all hover:scale-[1.02] active:scale-95"
            >
              <Icon name="add" />
              할 일 추가
            </button>
          </div>
        </div>
        {tabs && <div className="mt-6">{tabs}</div>}
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
            {error ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-body-md text-error">
                  {error}
                </td>
              </tr>
            ) : isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-body-md text-on-surface-variant">
                  불러오는 중...
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-body-md text-on-surface-variant">
                  표시할 할 일이 없습니다.
                </td>
              </tr>
            ) : (
              tasks.map((task, index) => (
                <TaskRow
                  key={task.id}
                  rank={index + 1}
                  task={task}
                  onComplete={onCompleteTask}
                  onMoveUp={onMoveTaskUp}
                  onMoveDown={onMoveTaskDown}
                  canMoveUp={index > 0}
                  canMoveDown={index < tasks.length - 1}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
