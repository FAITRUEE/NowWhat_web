import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Icon from '@/components/ui/Icon'
import HistoryPeriodTabs, { type HistoryPeriod } from '@/features/history/components/HistoryPeriodTabs'
import HistoryStatCard from '@/features/history/components/HistoryStatCard'
import CompletedTaskTable, { type CompletedTask } from '@/features/history/components/CompletedTaskTable'
import InsightBanner from '@/features/history/components/InsightBanner'
import { historyApi } from '@/features/history/api/historyApi'

const PERIOD_LABEL: Record<HistoryPeriod, string> = {
  week: '이번 주',
  month: '이번 달',
}

export default function HistoryPage() {
  const [period, setPeriod] = useState<HistoryPeriod>('week')

  const historyQuery = useQuery({
    queryKey: ['history', period],
    queryFn: () => historyApi.list(period),
  })

  const tasks: CompletedTask[] = useMemo(
    () =>
      (historyQuery.data ?? []).map((entry) => ({
        id: entry.taskId,
        title: entry.title,
        completedAt: entry.completedAt,
        estimatedMinutes: entry.estimatedMinutes,
        actualMinutes: entry.actualMinutes,
      })),
    [historyQuery.data],
  )

  const totalCompleted = tasks.length
  const onTimeCount = tasks.filter(
    (task) => task.estimatedMinutes !== null && task.actualMinutes <= task.estimatedMinutes,
  ).length
  const productivityScore = totalCompleted > 0 ? Math.round((onTimeCount / totalCompleted) * 100) : 0

  const periodLabel = PERIOD_LABEL[period]
  const insightTitle =
    totalCompleted > 0 ? `${periodLabel} ${totalCompleted}개의 과업을 완료했습니다!` : `${periodLabel}에는 아직 완료한 과업이 없습니다.`
  const insightDescription =
    totalCompleted > 0 ? '꾸준히 이 흐름을 유지해 보세요. 작은 완료들이 쌓여 큰 성과가 됩니다.' : '작은 일부터 하나씩 완료해 보세요.'

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 space-y-section-gap p-container-padding">
      <section className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
            <Icon name="history" filled />
          </div>
          <div>
            <h2 className="mb-2 text-headline-lg text-primary">완료 이력</h2>
            <p className="text-body-md text-on-surface-variant">지난 성과를 한눈에 확인하세요.</p>
          </div>
        </div>
        <HistoryPeriodTabs value={period} onChange={setPeriod} />
      </section>

      <section className="grid grid-cols-1 gap-gutter md:grid-cols-2">
        <HistoryStatCard
          icon="check_circle"
          iconBg="bg-secondary-fixed"
          iconColor="text-secondary"
          accent="bg-secondary/15 group-hover:bg-secondary/25"
          label="총 완료 과업"
          value={String(totalCompleted)}
        />
        <HistoryStatCard
          icon="bolt"
          iconBg="bg-primary-fixed"
          iconColor="text-primary"
          accent="bg-primary/10 group-hover:bg-primary/20"
          label="정시 완료율"
          value={`${productivityScore}%`}
          progress={productivityScore}
        />
      </section>

      <CompletedTaskTable
        tasks={tasks}
        isLoading={historyQuery.isLoading}
        error={historyQuery.isError ? '완료 이력을 불러오지 못했습니다.' : null}
      />

      <InsightBanner title={insightTitle} description={insightDescription} />
    </div>
  )
}
