'use client'
import React, { useState } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { startOfMonth, endOfMonth, format, subMonths, addMonths, parseISO, subDays } from 'date-fns'
import { log } from 'console'

type Session = {
  id: string
  date: string
  duration: number
  type: string
}

type HeatmapValue = {
  date: string
  count: number
  sessions: Session[]
}

export const SessionHeatmapClient: React.FC<{ sessions: Session[] }> = ({ sessions }) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const startDate = startOfMonth(currentDate)
  const endDate = endOfMonth(currentDate)

  // Filter sessions for current month
  const currentMonthSessions = sessions.filter(
    (session) => new Date(session.date) >= startDate && new Date(session.date) <= endDate,
  )

  // Group sessions by date
  const sessionsByDate = currentMonthSessions.reduce(
    (acc: { [key: string]: Session[] }, session) => {
      const dateStr = format(new Date(session.date), 'yyyy-MM-dd')
      if (!acc[dateStr]) {
        acc[dateStr] = []
      }
      acc[dateStr].push(session)
      return acc
    },
    {},
  )

  // Create heatmap values
  const heatmapValues: HeatmapValue[] = Object.entries(sessionsByDate).map(([date, sessions]) => ({
    date,
    count: sessions.length,
    sessions,
  }))

  // Calculate metadata
  const totalSessions = currentMonthSessions.length
  const maxSessionsDay = Object.entries(sessionsByDate).reduce(
    (max, [date, sessions]) => {
      if (sessions.length > max.count) {
        return { date, count: sessions.length }
      }
      return max
    },
    { date: '', count: 0 },
  )

  const handlePreviousMonth = () => {
    setCurrentDate((date) => subMonths(date, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate((date) => addMonths(date, 1))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {totalSessions} sessions in the last year
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePreviousMonth}
              className="px-3 py-2 border rounded-md hover:bg-gray-50 text-gray-900"
            >
              Previous
            </button>
            <span className="text-lg font-medium text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <button
              onClick={handleNextMonth}
              className="px-3 py-2 border rounded-md hover:bg-gray-50 text-gray-900"
            >
              Next
            </button>
          </div>
        </div>

        <div className="github-heatmap-container">
          <div className="flex mb-2 text-sm text-gray-700">
            <div className="flex-1"></div>
            <div className="flex space-x-1">
              <span>Less</span>
              <div className="flex space-x-1">
                <div className="h-4 w-4 rounded-sm bg-contribution-0"></div>
                <div className="h-4 w-4 rounded-sm bg-contribution-1"></div>
                <div className="h-4 w-4 rounded-sm bg-contribution-2"></div>
                <div className="h-4 w-4 rounded-sm bg-contribution-3"></div>
                <div className="h-4 w-4 rounded-sm bg-contribution-4"></div>
              </div>
              <span>More</span>
            </div>
          </div>

          <CalendarHeatmap
            startDate={subMonths(endDate, 11)}
            endDate={endDate}
            values={heatmapValues}
            classForValue={(value) => {
              if (!value) return 'color-empty'
              if (value.count === 0) return 'color-scale-0'
              return `color-scale-${Math.min(value.count, 4)}`
            }}
            titleForValue={(value) => {
              if (!value) return 'No sessions'
              return `${value.count} sessions on ${value.date}`
            }}
            showWeekdayLabels={true}
            weekdayLabels={['Sun', 'Mon', '', 'Wed', '', 'Fri', '']}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 border-t border-gray-200 pt-6">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-1">Year of sessions</h3>
            <p className="text-2xl font-semibold text-gray-900">{totalSessions} total</p>
            <p className="text-sm text-gray-600">
              {format(subMonths(endDate, 11), 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
            </p>
          </div>
          {maxSessionsDay.count > 0 && (
            <>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-1">Longest streak</h3>
                <p className="text-2xl font-semibold text-gray-900">{maxSessionsDay.count} days</p>
                <p className="text-sm text-gray-600">
                  {format(parseISO(maxSessionsDay.date), 'MMMM d')} - Current
                </p>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-1">Current streak</h3>
                <p className="text-2xl font-semibold text-gray-900">5 days</p>
                <p className="text-sm text-gray-600">
                  {format(subDays(new Date(), 5), 'MMMM d')} - Current
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
