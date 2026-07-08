import { useState } from 'react'
import Icon from '@/components/ui/Icon'
import { getDDayLabel } from '@/lib/date'
import type { TeamBundle } from '@/features/team/api/teamApi'

interface RoleBundlePoolProps {
  bundles: TeamBundle[]
  onReassign: (taskId: number) => void
  isReassigning?: boolean
}

function BundleCard({
  index,
  bundle,
  onReassign,
  isReassigning,
}: {
  index: number
  bundle: TeamBundle
  onReassign: (taskId: number) => void
  isReassigning?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const rankedTasks = [...bundle.tasks].sort((a, b) => b.score - a.score)

  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant/20 bg-white">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <Icon name="inventory_2" className="mt-0.5 text-secondary" />
        <div className="flex-1">
          <p className="text-body-md font-bold text-primary">
            역할 {index + 1} ({rankedTasks.length}개 업무)
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {rankedTasks.map((task) => (
              <span
                key={task.id}
                className="rounded-full bg-surface-container-low px-2.5 py-1 text-label-sm text-on-surface-variant"
              >
                {task.title}
              </span>
            ))}
          </div>
        </div>
        <Icon name={expanded ? 'expand_less' : 'expand_more'} className="text-on-surface-variant" />
      </button>

      {expanded && (
        <div className="space-y-2 border-t border-outline-variant/20 p-4 pt-3">
          <p className="text-label-sm text-on-surface-variant">우선순위 점수순으로 나열됐어요.</p>
          {rankedTasks.map((task, taskIndex) => (
            <div key={task.id} className="rounded-lg bg-surface-container-low/50 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-label-sm font-bold text-secondary">
                    {taskIndex + 1}
                  </span>
                  <p className="text-body-md font-bold text-primary">{task.title}</p>
                </div>
                <span className="shrink-0 rounded-full bg-surface-container px-2.5 py-0.5 text-label-sm font-bold text-on-surface-variant">
                  {getDDayLabel(task.deadline)}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between pl-7">
                <span className="text-label-sm text-on-surface-variant">담당자: {task.assigneeEmail}</span>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    onReassign(task.id)
                  }}
                  disabled={isReassigning}
                  className="flex items-center gap-1 rounded-lg border border-secondary/30 bg-secondary/10 px-3 py-1.5 text-label-sm font-bold text-secondary transition-all hover:bg-secondary/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Icon name="swap_horiz" className="text-sm" />
                  나로 바꾸기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function RoleBundlePool({ bundles, onReassign, isReassigning }: RoleBundlePoolProps) {
  if (bundles.length === 0) return null

  return (
    <section className="glass-card space-y-4 rounded-[24px] border border-secondary/20 bg-secondary/5 p-6">
      <div className="flex items-center gap-3">
        <Icon name="auto_awesome" filled className="text-secondary" />
        <div>
          <h3 className="text-headline-md text-primary">AI 역할 분배 ({bundles.length})</h3>
          <p className="text-label-sm text-on-surface-variant">
            카드를 눌러 안에 든 업무를 우선순위로 확인하고, 필요하면 "나로 바꾸기"로 담당자를 바꾸세요.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {bundles.map((bundle, index) => (
          <BundleCard
            key={bundle.id}
            index={index}
            bundle={bundle}
            onReassign={onReassign}
            isReassigning={isReassigning}
          />
        ))}
      </div>
    </section>
  )
}
