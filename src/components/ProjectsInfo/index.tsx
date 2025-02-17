'use client'

import React, { useEffect, useState } from 'react'
import { useFormFields } from '@payloadcms/ui'

interface Project {
  id: string
  title: string
}

interface Task {
  id: string
  title: string
  project: Project
}

const ProjectsInfo: React.FC = () => {
  // Get the current session data using useField
  const tasks = useFormFields(([fields, dispatch]) => fields.tasks)

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!tasks?.value || tasks.value.length === 0) {
          setProjects([])
          return
        }

        setLoading(true)
        setError(null)

        // Fetch all tasks with their related projects
        const tasksPromises = tasks.value.map((taskId) =>
          fetch(`/api/tasks/${taskId}?depth=1`).then((res) => {
            if (!res.ok) throw new Error('Failed to fetch task')
            return res.json()
          }),
        )

        const tasksData = await Promise.all(tasksPromises)

        // Extract unique projects from tasks
        const uniqueProjects = tasksData.reduce((acc: Project[], taskData) => {
          // The project data is directly on the taskData object since it's a single document response
          if (taskData?.relatedProject && !acc.some((p) => p.id === taskData.relatedProject.id)) {
            acc.push(taskData.relatedProject)
          }
          return acc
        }, [])

        setProjects(uniqueProjects)
      } catch (err) {
        setError('Failed to load project data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [tasks?.value])

  if (loading) {
    return <div className="field-type ui">Loading project info...</div>
  }

  if (error) {
    return (
      <div className="field-type ui" style={{ color: 'red' }}>
        {error}
      </div>
    )
  }

  if (!projects.length) {
    return (
      <div className="field-type ui">No projects associated with this session&apos;s tasks.</div>
    )
  }

  return (
    <div className="field-type ui">
      <label className="field-label">Related Projects</label>
      <div>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>{project.title}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ProjectsInfo
