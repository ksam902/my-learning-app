'use client'

import React from 'react'
import { Task } from '@/payload-types'
import { Checkbox } from '@/components/ui/checkbox'
import { getClientSideURL } from '@/utilities/getURL'
import { useRouter } from 'next/navigation'

export const TasksBlockClient: React.FC<{
  tasks: Task[]
}> = ({ tasks }) => {
  const router = useRouter()

  const handleComplete = async (taskId: string) => {
    try {
      await fetch(`${getClientSideURL()}/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: true,
        }),
      })

      router.refresh()
    } catch (error) {
      console.error('Error completing task:', error)
    }
  }

  if (!tasks?.length) {
    return (
      <div className="bg-card p-6 rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        <p className="text-muted-foreground">No pending tasks</p>
      </div>
    )
  }

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-start gap-3 group">
            <Checkbox
              id={task.id}
              className="mt-1"
              onCheckedChange={() => handleComplete(task.id)}
            />
            <div className="flex-1 min-w-0">
              <label htmlFor={task.id} className="block font-medium cursor-pointer">
                {task.title}
              </label>
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
