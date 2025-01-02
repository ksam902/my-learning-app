import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'relatedProject', 'taskType', 'status'],
    useAsTitle: 'title',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
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
                rows: 25,
              },
            },
          ],
          label: 'Meta',
        },
        {
          fields: [
            {
              name: 'codeSnippets',
              type: 'array',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'code',
                  type: 'code',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
              ],
            },
          ],
          label: 'Code Snippets',
        },
        {
          fields: [
            {
              name: 'relatedSessions',
              type: 'join',
              collection: 'sessions',
              on: 'tasks',
              admin: {
                description: 'Sessions logged to this Task',
              },
            },
          ],
          label: 'Related Sessions',
        },
      ],
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
      // TODO: validation with start date.
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Not Started', value: 'not-started' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Blocked', value: 'blocked' },
        { label: 'Needs Review', value: 'needs-review' },
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
      name: 'taskType',
      type: 'select',
      required: true,
      label: 'Type',
      options: [
        { label: 'Learning', value: 'learning' },
        { label: 'Implementation', value: 'implementation' },
        { label: 'Bug Fix', value: 'bug-fix' },
        { label: 'Documentation', value: 'documentation' },
        { label: 'Research', value: 'research' },
        { label: 'Review', value: 'review' },
        { label: 'Refactoring', value: 'refactoring' },
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
      name: 'relatedProject',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: false,
      admin: {
        description: 'Link to related Project',
        position: 'sidebar',
        sortOptions: 'title',
      },
    },
  ],
}
