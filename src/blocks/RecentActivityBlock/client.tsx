'use client'
import React, { useState } from 'react'
import { format } from 'date-fns'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'

type Session = {
  id: string
  createdAt: string
  duration: number
  goals?: Array<{
    id: string
    title: string
  }>
  progress?: string
}

export const RecentActivityClient: React.FC<{
  sessions: Session[]
}> = ({ sessions }) => {
  const [expandedSession, setExpandedSession] = useState<string | null>(null)

  return (
    <div className="border rounded-lg border-border bg-card">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {sessions.map((session) => {
          const isExpanded = expandedSession === session.id

          return (
            <div key={session.id} className="border-b border-border last:border-0">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(session.createdAt), 'MMM d, yyyy')}
                    </div>
                    <div className="text-sm">Duration: {session.duration} minutes</div>
                    {session.goals && session.goals.length > 0 && (
                      <div className="text-sm">
                        Goals: {session.goals.map((goal) => goal.title).join(', ')}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedSession(isExpanded ? null : session.id)}
                    className="ml-2"
                  >
                    {isExpanded ? (
                      <>
                        View less
                        <ChevronUp className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        View more
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>

                <div
                  className={cn(
                    'grid transition-all',
                    isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="pt-4">
                      <div className="text-sm">
                        <span className="font-medium">Progress: </span>
                        {session.progress || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
