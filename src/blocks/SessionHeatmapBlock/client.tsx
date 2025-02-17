'use client'
import React, { useState } from 'react'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import {
  startOfYear,
  endOfYear,
  format,
  subYears,
  addYears,
  parseISO,
  subDays,
  startOfMonth,
  endOfMonth,
} from 'date-fns'

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
  const [currentYear, setCurrentYear] = useState(new Date())

  const startDate = startOfYear(currentYear)
  const endDate = endOfYear(currentYear)

  // Filter sessions for current year
  const currentYearSessions = sessions.filter(
    (session) => new Date(session.date) >= startDate && new Date(session.date) <= endDate,
  )

  // Group sessions by date
  const sessionsByDate = currentYearSessions.reduce(
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

  // Calculate streaks
  const calculateStreaks = () => {
    const dates = Object.keys(sessionsByDate).sort()
    if (dates.length === 0)
      return { longest: 0, current: 0, longestStart: '', longestEnd: '', currentStart: '' }

    let currentStreak = 0
    let longestStreak = 0
    let currentStart = ''
    let longestStart = ''
    let longestEnd = ''

    // Calculate current streak
    const today = new Date()
    let currentDate = today
    while (sessionsByDate[format(currentDate, 'yyyy-MM-dd')]) {
      currentStreak++
      if (currentStreak === 1) currentStart = format(currentDate, 'yyyy-MM-dd')
      currentDate = subDays(currentDate, 1)
    }

    // Calculate longest streak
    let tempStreak = 0
    let tempStart = ''
    dates.forEach((date, index) => {
      if (index === 0) {
        tempStreak = 1
        tempStart = date
      } else {
        const prevDate = parseISO(dates[index - 1])
        const currDate = parseISO(date)
        const dayDiff = Math.abs((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

        if (dayDiff === 1) {
          tempStreak++
        } else {
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak
            longestStart = tempStart
            longestEnd = dates[index - 1]
          }
          tempStreak = 1
          tempStart = date
        }
      }
    })

    // Check final streak
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak
      longestStart = tempStart
      longestEnd = dates[dates.length - 1]
    }

    return {
      longest: longestStreak,
      current: currentStreak,
      longestStart,
      longestEnd,
      currentStart: currentStart || '',
    }
  }

  const streaks = calculateStreaks()

  const handlePreviousYear = () => {
    setCurrentYear((date) => subYears(date, 1))
  }

  const handleNextYear = () => {
    setCurrentYear((date) => addYears(date, 1))
  }

  // Calculate current month sessions
  const currentMonthStart = startOfMonth(new Date())
  const currentMonthEnd = endOfMonth(new Date())
  const currentMonthSessions = sessions.filter(
    (session) =>
      new Date(session.date) >= currentMonthStart && new Date(session.date) <= currentMonthEnd,
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <div className="bg-white shadow sm:rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-gray-900">
            {currentYearSessions.length} Sessions in {format(currentYear, 'yyyy')}
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePreviousYear}
              className="px-3 py-2 text-sm underline text-gray-900"
            >
              Previous
            </button>
            <button onClick={handleNextYear} className="px-3 py-2 text-sm underline text-gray-900">
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

          <div className="calendar-wrapper">
            <CalendarHeatmap
              startDate={startDate}
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
              gutterSize={4}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 border-t border-gray-200">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-1">Sessions this Month</h3>
            <p className="text-2xl font-semibold text-gray-900">
              {currentMonthSessions.length} total
            </p>
            <p className="text-sm text-gray-600">
              {format(currentMonthStart, 'MMM d, yyyy')} - {format(currentMonthEnd, 'MMM d, yyyy')}
            </p>
          </div>
          {streaks.longest > 0 && (
            <>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-1">Longest streak</h3>
                <p className="text-2xl font-semibold text-gray-900">{streaks.longest} days</p>
                <p className="text-sm text-gray-600">
                  {format(parseISO(streaks.longestStart), 'MMMM d')} -{' '}
                  {format(parseISO(streaks.longestEnd), 'MMMM d')}
                </p>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-1">Current streak</h3>
                <p className="text-2xl font-semibold text-gray-900">{streaks.current} days</p>
                <p className="text-sm text-gray-600">
                  {streaks.current > 0
                    ? `${format(parseISO(streaks.currentStart), 'MMMM d')} - Current`
                    : 'No current streak'}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
