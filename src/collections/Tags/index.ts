import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'

export const Tags: CollectionConfig = {
  slug: 'tags',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'updatedAt', 'createdAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'relatedGoals',
              type: 'join',
              collection: 'goals', // Reference the tasks collection
              on: 'tags', // Field name in Tasks collection that references tags
              admin: {
                description: 'Goals using this Tag',
              },
            },
          ],
          label: 'Related Goals',
        },
        {
          fields: [
            {
              name: 'relatedProjects',
              type: 'join',
              collection: 'projects', // Reference the tasks collection
              on: 'tags', // Field name in Tasks collection that references tags
              admin: {
                description: 'Projects using this Tag',
                defaultColumns: ['title'],
              },
            },
          ],
          label: 'Related Projects',
        },
        {
          fields: [
            {
              name: 'relatedTasks',
              type: 'join',
              collection: 'tasks', // Reference the tasks collection
              on: 'tags', // Field name in Tasks collection that references tags
              admin: {
                description: 'Tasks using this Tag',
              },
            },
          ],
          label: 'Related Tasks',
        },
        {
          fields: [
            {
              name: 'relatedResources',
              type: 'join',
              collection: 'resources', // Reference the tasks collection
              on: 'tags', // Field name in Tasks collection that references tags
              admin: {
                description: 'Resources using this Tag',
                defaultColumns: ['title', 'url'],
              },
            },
          ],
          label: 'Related Resources',
        },
      ],
    },
  ],
}
