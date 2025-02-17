import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { GoalBreakdownClient } from './client'
import './styles.scss'

export type GoalBreakdownBlockProps = {
  blockType: 'goalBreakdown'
}

export const GoalBreakdownBlock: React.FC = async () => {
  const payload = await getPayload({ config: configPromise })

  const { docs: goals } = await payload.find({
    collection: 'goals',
    where: {
      status: {
        equals: 'in-progress',
      },
    },
    depth: 2,
  })

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

  const goalsWithTime = goals.map((goal, index) => ({
    id: goal.id,
    title: goal.title,
    priority: goal.priority,
    endDate: goal.endDate,
    dependencies: goal.dependencies,
    timeInvested: allSessions[index].reduce((sum, session) => sum + (session.duration || 0), 0),
  }))

  return <GoalBreakdownClient goals={goalsWithTime} />
}
