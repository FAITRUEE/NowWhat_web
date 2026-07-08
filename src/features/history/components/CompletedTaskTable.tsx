import { useState } from 'react'
import Icon from '@/components/ui/Icon'
import CompletedTaskRow from '@/features/history/components/CompletedTaskRow'

export interface CompletedTask {
  id: number
  title: string
  completedAt: string
  estimatedMinutes: number | null
  actualMinutes: number
  deadline: string
}

const PAGE_SIZE = 4
const COLUMN_COUNT = 3

interface CompletedTaskTableProps {
  tasks: CompletedTask[]
  isLoading?: boolean
  error?: string | null
}

export default function CompletedTaskTable({ tasks, isLoading, error }: CompletedTaskTableProps) {
  const [page, setPage] = useState(0)
  const pageCount = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount - 1)
  const pageTasks = tasks.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE)
  const rangeStart = tasks.length === 0 ? 0 : currentPage * PAGE_SIZE + 1
  const rangeEnd = Math.min(tasks.length, currentPage * PAGE_SIZE + PAGE_SIZE)

  return (
    <section className="glass-card overflow-hidden rounded-[24px] border border-outline-variant/20">
      <div className="flex items-center gap-3 border-b border-outline-variant/20 px-8 py-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
          <Icon name="checklist" filled className="text-xl" />
        </div>
        <h3 className="text-headline-md text-primary">완료된 과업 목록</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="px-8 py-4 text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                과업명 &amp; 날짜
              </th>
              <th className="px-8 py-4 text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                소요 시간
              </th>
              <th className="px-8 py-4 text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                상태
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {error ? (
              <tr>
                <td colSpan={COLUMN_COUNT} className="p-8 text-center text-body-md text-error">
                  {error}
                </td>
              </tr>
            ) : isLoading ? (
              <tr>
                <td colSpan={COLUMN_COUNT} className="p-8 text-center text-body-md text-on-surface-variant">
                  불러오는 중...
                </td>
              </tr>
            ) : pageTasks.length === 0 ? (
              <tr>
                <td colSpan={COLUMN_COUNT} className="p-8 text-center text-body-md text-on-surface-variant">
                  완료된 과업이 없습니다.
                </td>
              </tr>
            ) : (
              pageTasks.map((task) => <CompletedTaskRow key={task.id} task={task} />)
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-outline-variant/20 bg-surface-container-low/30 px-8 py-6">
        <p className="text-label-md text-on-surface-variant">
          {rangeStart}-{rangeEnd} / {tasks.length} 과업 표시 중
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={currentPage === 0}
            className="rounded-lg border border-outline-variant/30 p-2 text-on-surface-variant transition-all hover:bg-white active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            <Icon name="chevron_left" />
          </button>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
            disabled={currentPage >= pageCount - 1}
            className="rounded-lg border border-outline-variant/30 p-2 text-on-surface-variant transition-all hover:bg-white active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            <Icon name="chevron_right" />
          </button>
        </div>
      </div>
    </section>
  )
}
