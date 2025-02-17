import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RecentActivityClient } from './client'
import './styles.scss'

export const RecentActivityBlock: React.FC = async () => {
  const payload = await getPayload({ config: configPromise })

  const sessions = await payload.find({
    collection: 'sessions',
    depth: 2,
    limit: 25,
    sort: '-createdAt',
  })

  return <RecentActivityClient sessions={sessions.docs} />
}
