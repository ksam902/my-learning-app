// components/cells/StatusCell.tsx
'use client'
import React from 'react'
import type { DefaultCellComponentProps } from 'payload'

const styles = {
  'not-started': {
    backgroundColor: '#F3F4F6', // Gray
    color: '#1F2937',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block',
  },
  'in-progress': {
    backgroundColor: '#FEF3C7', // Yellow
    color: '#92400E',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block',
  },
  completed: {
    backgroundColor: '#D1FAE5', // Green
    color: '#065F46',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block',
  },
  blocked: {
    backgroundColor: '#FEE2E2', // Red
    color: '#991B1B',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block',
  },
  'needs-review': {
    backgroundColor: '#E0E7FF', // Blue
    color: '#3730A3',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block',
  },
} as const

const StatusCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  if (!cellData) return null

  const status = cellData as keyof typeof styles

  return <span style={styles[status]}>{status.replace('-', ' ')}</span>
}

export default StatusCell
