import type { Metadata } from 'next'

import { GoalsBlock } from '@/blocks/GoalsBlock/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { draftMode } from 'next/headers'
import React from 'react'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import PageClient from './page.client'
import SessionHeatmapBlock from '@/blocks/SessionHeatmapBlock/Component'

export default async function Dashboard() {
  const { isEnabled: draft } = await draftMode()
  const url = '/dashboard'

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <GoalsBlock />
      <SessionHeatmapBlock />
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Dashboard',
    description: 'Your personal dashboard',
  }
}
