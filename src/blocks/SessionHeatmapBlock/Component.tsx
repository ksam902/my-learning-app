import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SessionHeatmapClient } from './client'
import './styles.scss'

const SessionHeatmapBlock = async () => {
  const payload = await getPayload({ config: configPromise })
  const { docs: sessions } = await payload.find({
    collection: 'sessions',
  })

  payload.logger.info('session : ', sessions)

  return (
    <SessionHeatmapClient sessions={sessions.map((session) => ({ ...session, type: 'session' }))} />
  )
}

export default SessionHeatmapBlock
