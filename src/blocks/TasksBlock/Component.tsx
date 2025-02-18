import React from 'react'
import { TasksBlockClient } from './Component.client'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const TasksBlock: React.FC = async () => {
  const payload = await getPayload({ config: configPromise })

  const { docs: tasks } = await payload.find({
    collection: 'tasks',
    where: {
      completed: {
        not_equals: true,
      },
    },
    sort: '-createdAt',
  })

  return <TasksBlockClient tasks={tasks} />
}
