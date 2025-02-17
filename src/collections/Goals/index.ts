import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Goals: CollectionConfig = {
  slug: 'goals',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'goalType', 'startDate', 'endDate', 'status'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'milestones',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'completed',
          type: 'checkbox',
        },
      ],
    },
    {
      name: 'relatedProjects',
      type: 'join',
      collection: 'projects', // Reference the tasks collection
      on: 'relatedGoals', // Field name in Tasks collection that references tags
      admin: {
        defaultColumns: ['title', 'projectType'],
      },
    },
    {
      name: 'relatedSessions',
      type: 'join',
      collection: 'sessions',
      on: 'goals',
      admin: {
        description: 'Sessions logged to this Goal',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM. do, yyyy',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM. do, yyyy',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Not Started', value: 'not-started' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'not-started',
      admin: {
        position: 'sidebar',
        components: {
          Cell: '@/components/StatusCell',
        },
      },
    },
    {
      name: 'goalType',
      type: 'select',
      required: true,
      label: 'Type',
      options: [
        { label: 'Personal', value: 'personal' },
        { label: 'Work', value: 'work' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        sortOptions: 'title',
      },
      hasMany: true,
      relationTo: 'tags',
    },
  ],
}
