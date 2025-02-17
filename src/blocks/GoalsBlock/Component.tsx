import React from 'react'
import { format, differenceInDays } from 'date-fns'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles =
    {
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800',
    }[status] || 'bg-gray-100 text-gray-800'

  const displayStatus =
    {
      'in-progress': 'In Progress',
      completed: 'Complete',
      archived: 'Archived',
    }[status] || status

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}
    >
      {displayStatus}
    </span>
  )
}

const DaysRemainingBadge: React.FC<{ startDate?: string; endDate?: string }> = ({
  startDate,
  endDate,
}) => {
  if (!startDate || !endDate) return null

  const daysRemaining = differenceInDays(new Date(endDate), new Date())

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Past due'}
    </span>
  )
}

export type GoalsBlockProps = {
  blockType: 'goals'
}

export const GoalsBlock = async () => {
  const payload = await getPayload({ config: configPromise })

  const { docs: goals } = await payload.find({
    collection: 'goals',
    where: {
      status: {
        equals: 'in-progress',
      },
    },
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-6">In Progress Goals</h2>
      <div className="bg-white shadow sm:rounded-lg">
        <div className="divide-y divide-gray-200">
          {goals.map((goal) => (
            <div key={goal.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900">{goal.title}</h3>
                      <StatusBadge status={goal.status} />
                      <DaysRemainingBadge startDate={goal.startDate} endDate={goal.endDate} />
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        View project
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-500">BUTTON</button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {goal.startDate && (
                      <span>Start: {format(new Date(goal.startDate), 'MMMM d, yyyy')}</span>
                    )}
                    <span className="mx-2">•</span>
                    {goal.endDate && (
                      <span>End: {format(new Date(goal.endDate), 'MMMM d, yyyy')}</span>
                    )}
                    <span className="mx-2">•</span>
                    <span>Type: {goal.goalType}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
