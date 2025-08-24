import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  CheckSquare,
  Eye
} from 'lucide-react'

import DashboardLayout from '@/components/DashboardLayout'
import DynamicCard, { DynamicCardContent } from '@/components/ui/dynamic-card'
import DynamicButton from '@/components/ui/dynamic-button'
import DynamicBadge from '@/components/ui/dynamic-badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import api from '@/services/api'
import { getStatusColor, getDynamicColor } from '@/styles/dynamic-utils'
import { colors, spacing } from '@/styles/tokens'

interface Project {
  id: string
  name: string
  description: string
  color: string
  isPublic: boolean
  status: string
  owner: {
    id: string
    name: string
    email: string
  }
  members: Array<{
    id: string
    role: string
    user: {
      id: string
      name: string
      email: string
    }
  }>
  _count: {
    tasks: number
    members: number
  }
}

interface CreateProjectData {
  name: string
  description: string
  color: string
  isPublic: boolean
}

const ProjectsPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState<CreateProjectData>({
    name: '',
    description: '',
    color: getDynamicColor('primary', '600'),
    isPublic: false
  })

  const queryClient = useQueryClient()

  // Fetch projects
  const { data: projectsData, isLoading, error } = useQuery<{ data: { projects: Project[] } }>(
    'projects',
    () => api.get('/api/projects').then(res => res.data)
  )

  // Create project mutation
  const createProjectMutation = useMutation(
    (data: CreateProjectData) => api.post('/api/projects', data).then(res => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('projects')
        toast.success('Project created successfully!')
        handleCloseDialog()
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to create project')
      }
    }
  )

  // Update project mutation
  const updateProjectMutation = useMutation(
    ({ id, data }: { id: string; data: CreateProjectData }) =>
      api.put(`/api/projects/${id}`, data).then(res => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('projects')
        toast.success('Project updated successfully!')
        handleCloseDialog()
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update project')
      }
    }
  )

  // Delete project mutation
  const deleteProjectMutation = useMutation(
    (id: string) => api.delete(`/api/projects/${id}`).then(res => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('projects')
        toast.success('Project deleted successfully!')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to delete project')
      }
    }
  )

  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setFormData({
        name: project.name,
        description: project.description,
        color: project.color,
        isPublic: project.isPublic
      })
    } else {
      setEditingProject(null)
      setFormData({
        name: '',
        description: '',
        color: getDynamicColor('primary', '600'),
        isPublic: false
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingProject(null)
    setFormData({
      name: '',
      description: '',
      color: getDynamicColor('primary', '600'),
      isPublic: false
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProject) {
      updateProjectMutation.mutate({ id: editingProject.id, data: formData })
    } else {
      createProjectMutation.mutate(formData)
    }
  }

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProjectMutation.mutate(id)
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Active'
      case 'COMPLETED':
        return 'Completed'
      case 'ARCHIVED':
        return 'Archived'
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div 
              className="animate-spin rounded-full h-8 w-8 border-b-2"
              style={{ borderColor: getDynamicColor('primary', '600') }}
            ></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertDescription>Failed to load projects</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  const projects = projectsData?.data.projects || []

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: getDynamicColor('gray', '900') }}>Projects</h1>
            <p style={{ color: getDynamicColor('gray', '600') }}>
              Manage and organize your project portfolio
            </p>
          </div>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <DynamicButton onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </DynamicButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </DialogTitle>
                <DialogDescription>
                  {editingProject ? 'Update project details below.' : 'Add a new project to your portfolio.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter project name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter project description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <span className="text-sm" style={{ color: getDynamicColor('gray', '600') }}>Choose project color</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select
                    value={formData.isPublic ? 'public' : 'private'}
                    onValueChange={(value) => setFormData({ ...formData, isPublic: value === 'public' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <DynamicButton type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </DynamicButton>
                  <DynamicButton 
                    type="submit" 
                    disabled={createProjectMutation.isLoading || updateProjectMutation.isLoading}
                  >
                    {editingProject ? 'Update' : 'Create'}
                  </DynamicButton>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <DynamicCard variant="default">
            <DynamicCardContent className="text-center py-12">
              <CheckSquare className="h-12 w-12 mx-auto mb-4" style={{ color: getDynamicColor('gray', '600') }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: getDynamicColor('gray', '900') }}>No projects yet</h3>
              <p className="mb-6 max-w-md mx-auto" style={{ color: getDynamicColor('gray', '600') }}>
                Create your first project to get started with project management
              </p>
              <DynamicButton onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </DynamicButton>
            </DynamicCardContent>
          </DynamicCard>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <DynamicCard key={project.id} variant="default" className="group hover:shadow-md transition-all duration-200">
                <div 
                  className="h-2 rounded-t-lg" 
                  style={{ backgroundColor: project.color }}
                />
                <DynamicCardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg leading-tight truncate mb-1" style={{ color: getDynamicColor('gray', '900') }}>
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-sm line-clamp-2 mb-3" style={{ color: getDynamicColor('gray', '600') }}>
                          {project.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <DynamicButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(project)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </DynamicButton>
                      <DynamicButton
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                        className="h-8 w-8 p-0"
                        style={{ color: getDynamicColor('error', '600') }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </DynamicButton>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <DynamicBadge 
                      variant="secondary" 
                      size="sm"
                      style={{ 
                        backgroundColor: getDynamicColor(getStatusColor(project.status).bg.replace('bg-', '').split('-')[0], getStatusColor(project.status).bg.replace('bg-', '').split('-')[1]),
                        color: 'white'
                      }}
                    >
                      {getStatusText(project.status)}
                    </DynamicBadge>
                    {project.isPublic && (
                      <DynamicBadge variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        Public
                      </DynamicBadge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm" style={{ color: getDynamicColor('gray', '600') }}>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{project._count.members} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckSquare className="h-4 w-4" />
                      <span>{project._count.tasks} tasks</span>
                    </div>
                  </div>
                </DynamicCardContent>
              </DynamicCard>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ProjectsPage 