import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Sessions: CollectionConfig = {
  slug: 'sessions',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['date', 'duration', 'timeOfDay', 'tasks', 'projectsInfo'],
  },
  fields: [
    {
      name: 'progress',
      type: 'textarea',
      admin: {
        description: 'What did you accomplish during this session?',
        rows: 5,
      },
    },
    {
      name: 'learning',
      type: 'array',
      fields: [
        {
          name: 'description',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'blockers',
      type: 'array',
      fields: [
        {
          name: 'description',
          type: 'text',
          required: true,
        },
        {
          name: 'resolution',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'nextSteps',
      type: 'textarea',
      admin: {
        description: 'What needs to be done next?',
        rows: 5,
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'MMM. do, yyyy',
        },
      },
    },
    {
      name: 'duration',
      type: 'number',
      required: true,
      min: 1,
      admin: {
        description: 'Duration in minutes',
        step: 1,
        position: 'sidebar',
        components: {
          Cell: '@/components/DurationCell',
        },
      },
    },

    {
      name: 'timeOfDay',
      type: 'select',
      options: [
        { label: 'Morning', value: 'morning' },
        { label: 'Afternoon', value: 'afternoon' },
        { label: 'Evening', value: 'evening' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tasks',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        sortOptions: 'title',
      },
      hasMany: true,
      relationTo: 'tasks',
    },
    {
      name: 'projectsInfo', // This won't be stored in the database
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/ProjectsInfo',
        },
      },
    },
    {
      name: 'energy',
      type: 'select',
      options: [
        { label: 'Very Low', value: '1' },
        { label: 'Low', value: '2' },
        { label: 'Medium', value: '3' },
        { label: 'High', value: '4' },
        { label: 'Very High', value: '5' },
      ],
      admin: {
        description: 'How was your energy level during this session?',
        position: 'sidebar',
      },
    },
    {
      name: 'focus',
      type: 'select',
      options: [
        { label: 'Very Distracted', value: '1' },
        { label: 'Somewhat Distracted', value: '2' },
        { label: 'Moderate Focus', value: '3' },
        { label: 'Focused', value: '4' },
        { label: 'Deep Focus', value: '5' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
