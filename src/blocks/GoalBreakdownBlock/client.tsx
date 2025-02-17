'use client'

import React from 'react'
import { format, isPast, isToday } from 'date-fns'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

type GoalWithTime = {
  id: string
  title: string
  priority: 'high' | 'medium' | 'low'
  endDate: string
  dependencies?: Array<{ id: string; title: string }> | null
  timeInvested: number
}

type Props = {
  goals: GoalWithTime[]
}

const COLORS = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#10B981',
}

export const GoalBreakdownClient: React.FC<Props> = ({ goals }) => {
  const timeData = goals.map((goal) => ({
    name: goal.title,
    value: goal.timeInvested,
    priority: goal.priority,
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
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {timeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.priority]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${Math.round(value / 60)} hours`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const GoalCard: React.FC<{ goal: GoalWithTime }> = ({ goal }) => (
  <div className="border rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-medium">{goal.title}</h3>
      <PriorityBadge priority={goal.priority} />
    </div>
    <div className="text-sm text-gray-500 space-y-2">
      <div className="flex items-center space-x-2">
        <span>Deadline:</span>
        <DeadlineIndicator date={goal.endDate} />
      </div>
      <div>Time invested: {Math.round(goal.timeInvested / 60)} hours</div>
      {goal.dependencies?.length > 0 && <DependenciesList dependencies={goal.dependencies} />}
    </div>
  </div>
)

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const colors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-amber-100 text-amber-800',
    low: 'bg-emerald-100 text-emerald-800',
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[priority]}`}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  )
}

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
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}
    >
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
