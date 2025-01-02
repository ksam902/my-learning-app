// components/cells/DurationCell.tsx
'use client'
import React from 'react'
import type { DefaultCellComponentProps } from 'payload'

const DurationCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  if (!cellData) return null

  return <span>{cellData} mins.</span>
}

export default DurationCell
