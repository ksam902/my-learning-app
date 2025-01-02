import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Projects: CollectionConfig = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'projectType', 'tags', 'relatedGoals'],
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
      admin: {
        rows: 10,
      },
    },
    {
      name: 'objectives',
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
      name: 'relatedTasks',
      type: 'join',
      collection: 'tasks', // Reference the tasks collection
      on: 'relatedProject', // Field name in Tasks collection that references tags
      admin: {
        defaultColumns: ['title', 'status'],
      },
    },
    {
      name: 'projectType',
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
    {
      name: 'relatedGoals',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        sortOptions: 'title',
      },
      hasMany: true,
      relationTo: 'goals',
    },
  ],
}
