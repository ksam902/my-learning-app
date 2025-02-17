import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SessionHeatmapClient } from './client'
import './styles.scss'

export const SessionHeatmapBlock = async () => {
  const payload = await getPayload({ config: configPromise })
  const { docs: sessions } = await payload.find({
    collection: 'sessions',
  })

  return (
    <SessionHeatmapClient sessions={sessions.map((session) => ({ ...session, type: 'session' }))} />
  )
}
