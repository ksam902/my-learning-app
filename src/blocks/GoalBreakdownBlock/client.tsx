'use client'

import React from 'react'
import { format, isPast, isToday } from 'date-fns'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

type GoalWithTime = {
  id: string
  title: string
  endDate: string
  dependencies?: Array<{ id: string; title: string }> | null
  timeInvested: number
}

type Props = {
  goals: GoalWithTime[]
}

const CHART_COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EC4899', // pink-500
  '#8B5CF6', // violet-500
  '#14B8A6', // teal-500
  '#F43F5E', // rose-500
  '#6366F1', // indigo-500
]

export const GoalBreakdownClient: React.FC<Props> = ({ goals }) => {
  const timeData = goals.map((goal) => ({
    name: goal.title,
    value: goal.timeInvested,
  }))

  return (
    <div className="goal-breakdown max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Goal Time Allocation</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={timeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {timeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${Math.round(value / 60)} hours`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {goals.map((goal, index) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                color={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const GoalCard: React.FC<{ goal: GoalWithTime; color: string }> = ({ goal, color }) => (
  <div className="border rounded-lg p-3">
    <div className="flex items-center gap-2 mb-1">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
      <h3 className="text-sm font-medium">{goal.title}</h3>
    </div>
    <div className="text-xs text-gray-500 space-y-1">
      <div className="flex items-center justify-between">
        <DeadlineIndicator date={goal.endDate} />
        <span>{Math.round(goal.timeInvested / 60)} hours</span>
      </div>
      {goal.dependencies?.length > 0 && <DependenciesList dependencies={goal.dependencies} />}
    </div>
  </div>
)

const DeadlineIndicator: React.FC<{ date: string }> = ({ date }) => {
  const deadlineDate = new Date(date)
  const isPastDue = isPast(deadlineDate) && !isToday(deadlineDate)
  const isTodays = isToday(deadlineDate)
  const styles = isPastDue
    ? 'bg-red-100 text-red-800'
    : isTodays
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-gray-100 text-gray-800'
  return (
    <span className={`text-xs ${styles} px-2 py-0.5 rounded-full`}>
      {format(deadlineDate, 'MMM d, yyyy')}
    </span>
  )
}

const DependenciesList: React.FC<{ dependencies: Array<{ id: string; title: string }> }> = ({
  dependencies,
}) => (
  <div>
    <span className="text-gray-700">Dependencies:</span>
    <div className="ml-2 mt-1">
      {dependencies.map((dep) => (
        <span key={dep.id} className="inline-block bg-gray-100 rounded px-2 py-1 text-xs mr-2 mb-1">
          {dep.title}
        </span>
      ))}
    </div>
  </div>
)
