'use client'
import React, { useState } from 'react'
import { format } from 'date-fns'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import './styles.scss'

type Session = {
  id: string
  createdAt: string
  duration: number
  goals?: Array<{
    id: string
    title: string
  }>
  progress?: string
  timeOfDay: string
}

export const RecentActivityClient: React.FC<{
  sessions: Session[]
}> = ({ sessions }) => {
  const [expandedSession, setExpandedSession] = useState<string | null>(null)

  return (
    <div className="recent-activity max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold">Recent Activity</h2>
        </div>

        <div className="px-6 max-h-[600px] overflow-y-auto">
          {sessions.map((session) => {
            const isExpanded = expandedSession === session.id
            const sessionDate = new Date(session.createdAt)

            return (
              <div key={session.id} className="session-card py-6 first:pt-4 last:pb-4">
                <div className="flex items-center justify-between gap-8">
                  <div className="grid grid-cols-[auto_auto_1fr] items-center gap-8 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      <span className="session-date">{format(sessionDate, 'MMMM d')}</span>
                      <span className="session-time ml-2">
                        {session.timeOfDay} | {session.duration} minutes
                      </span>
                    </div>

                    <span className="text-sm text-gray-600 whitespace-nowrap"></span>

                    {session.goals && session.goals.length > 0 && (
                      <div className="goals-list overflow-hidden">
                        {session.goals.map((goal) => (
                          <span key={goal.id} className="goal-tag">
                            {goal.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedSession(isExpanded ? null : session.id)}
                    className="flex-shrink-0 h-8"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div
                  className={cn(
                    'grid transition-all duration-200',
                    isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="pt-4">
                      <div className="text-sm text-gray-600">
                        <p className="whitespace-pre-wrap">
                          {session.progress || 'No progress notes recorded.'}
                        </p>
                      </div>
                    </div>
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
