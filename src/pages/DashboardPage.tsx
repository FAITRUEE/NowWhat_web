import { useState } from 'react'
import ViewTabs from '@/features/tasks/components/ViewTabs'
import PriorityTaskSection from '@/features/tasks/components/PriorityTaskSection'
import type { PriorityTask } from '@/features/tasks/components/PriorityTaskSection'
import UrgentItemsCard from '@/features/tasks/components/UrgentItemsCard'
import ProductivityScoreCard from '@/features/tasks/components/ProductivityScoreCard'
import AddTaskModal, { type NewTaskInput } from '@/features/tasks/components/AddTaskModal'
import { mockPriorityTasks, mockUrgentItems, mockProductivity } from '@/features/tasks/mock/dashboardMock'
import type { TaskView } from '@/types/task'

export default function DashboardPage() {
  const [view, setView] = useState<TaskView>('today')
  const [tasks, setTasks] = useState<PriorityTask[]>(mockPriorityTasks)
  const [isAddModalOpen, setAddModalOpen] = useState(false)

  function handleAddTask(input: NewTaskInput) {
    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title: input.title,
        deadline: input.deadline,
        score: input.importance * 15,
        estimatedMinutes: input.estimatedMinutes,
      },
    ])
    setAddModalOpen(false)
  }

  return (
    <>
      <div className="mx-auto w-full max-w-7xl flex-1 space-y-section-gap p-container-padding">
        <PriorityTaskSection
          tasks={tasks}
          onAddClick={() => setAddModalOpen(true)}
          tabs={<ViewTabs value={view} onChange={setView} />}
        />
        <section className="mx-auto grid max-w-5xl grid-cols-1 gap-gutter pb-12 lg:grid-cols-2">
          <UrgentItemsCard items={mockUrgentItems} />
          <ProductivityScoreCard
            score={mockProductivity.score}
            deltaLabel={mockProductivity.deltaLabel}
            comparisonLabel={mockProductivity.comparisonLabel}
          />
        </section>
      </div>
      <AddTaskModal open={isAddModalOpen} onClose={() => setAddModalOpen(false)} onSubmit={handleAddTask} />
    </>
  )
}
