'use client'

import React from 'react'

type Milestone = {
  id: string
  title: string
  completed: boolean
}

type MilestonesModalProps = {
  isOpen: boolean
  onClose: () => void
  milestones: Milestone[]
  goalTitle: string
}

export const MilestonesModal: React.FC<MilestonesModalProps> = ({
  isOpen,
  onClose,
  milestones,
  goalTitle,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{goalTitle} - Milestones</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="flex items-center space-x-3 p-3 border rounded-lg">
              <div
                className={`flex-shrink-0 ${milestone.completed ? 'text-green-500' : 'text-gray-400'}`}
              >
                {milestone.completed ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span
                className={`flex-grow ${milestone.completed ? 'text-gray-600' : 'text-gray-900'}`}
              >
                {milestone.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
