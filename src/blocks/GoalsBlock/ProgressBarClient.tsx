'use client'

import React, { useState } from 'react'
import { MilestonesModal } from './MilestonesModal'

type Milestone = {
  id: string
  title: string
  completed: boolean
}

type ProgressBarClientProps = {
  completed: number
  total: number
  milestones: Milestone[]
  goalTitle: string
}

export const ProgressBarClient: React.FC<ProgressBarClientProps> = ({
  completed,
  total,
  milestones,
  goalTitle,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <>
      <div className="mt-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Progress</span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none underline"
          >
            {completed}/{total} milestones • {percentage}%
          </button>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
      <MilestonesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        milestones={milestones}
        goalTitle={goalTitle}
      />
    </>
  )
}
