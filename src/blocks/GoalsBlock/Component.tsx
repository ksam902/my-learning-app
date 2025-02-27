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

const DaysRemainingBadge: React.FC<{ startDate?: string | null; endDate?: string | null }> = ({
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

const ProgressBar: React.FC<{ completed: number; total: number }> = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-600">Progress</span>
        <span className="text-sm text-gray-600">
          {completed}/{total} milestones • {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  )
}

const TimeInvested: React.FC<{ minutes: number }> = ({ minutes }) => {
  const hours = Math.round((minutes / 60) * 10) / 10

  return (
    <div className="flex items-center space-x-1 text-sm text-gray-500">
      <span>Time invested:</span>
      <span>{hours} hours</span>
    </div>
  )
}

export type GoalsBlockProps = {
  blockType: 'goals'
}

export const GoalsBlock = async () => {
  // const [activeFilter, setActiveFilter] = React.useState('in-progress')
  const payload = await getPayload({ config: configPromise })

  const { docs: goals } = await payload.find({
    collection: 'goals',
    where: {
      status: {
        // equals: activeFilter,
        equals: 'in-progress',
      },
    },
    depth: 2, // To get milestone data
  })

  // Get all sessions for these goals
  const sessionsPromises = goals.map(async (goal) => {
    const { docs: sessions } = await payload.find({
      collection: 'sessions',
      where: {
        goals: {
          equals: goal.id,
        },
      },
    })
    return sessions
  })

  const allSessions = await Promise.all(sessionsPromises)

  // Calculate time invested for each goal
  const timeInvested = goals.reduce((acc, goal, index) => {
    acc[goal.id] = allSessions[index].reduce((sum, session) => sum + (session.duration || 0), 0)
    return acc
  }, {})

  const statusOptions = ['in-progress', 'completed', 'archived']

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Goals</h2>
        <div className="flex space-x-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              // onClick={() => setActiveFilter(status)}
              // className={`px-4 py-2 rounded-md text-sm font-medium ${
              //   activeFilter === status
              //     ? 'bg-blue-600 text-white'
              //     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              // }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="divide-y divide-gray-200">
          {goals.map((goal) => {
            const completedMilestones = goal.milestones?.filter((m) => m.completed)?.length || 0
            const totalMilestones = goal.milestones?.length || 0

            return (
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
                      <span className="mx-2">•</span>
                      <TimeInvested minutes={timeInvested[goal.id]} />
                    </div>

                    <ProgressBar completed={completedMilestones} total={totalMilestones} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
