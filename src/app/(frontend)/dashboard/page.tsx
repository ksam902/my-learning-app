import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { draftMode } from 'next/headers'
import React from 'react'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import PageClient from './page.client'
import { GoalsBlock } from '@/blocks/GoalsBlock/Component'
import { SessionHeatmapBlock } from '@/blocks/SessionHeatmapBlock/Component'
import { GoalBreakdownBlock } from '@/blocks/GoalBreakdownBlock/Component'
import { RecentActivityBlock } from '@/blocks/RecentActivityBlock/Component'

export default async function Dashboard() {
  const { isEnabled: draft } = await draftMode()
  const url = '/dashboard'

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <GoalsBlock />
          <GoalBreakdownBlock />
        </div>
        <div>
          <SessionHeatmapBlock />
          <RecentActivityBlock />
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Dashboard',
    description: 'Your personal dashboard',
  }
}
