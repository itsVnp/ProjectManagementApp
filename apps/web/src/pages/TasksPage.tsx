import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { 
  Plus, 
  Trash2, 
  Calendar,
  Columns,
  List,
  CheckSquare
} from 'lucide-react'

import DashboardLayout from '@/components/DashboardLayout'
import DynamicCard, { DynamicCardContent, DynamicCardHeader, DynamicCardTitle } from '@/components/ui/dynamic-card'
import DynamicButton from '@/components/ui/dynamic-button'
import DynamicBadge from '@/components/ui/dynamic-badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/services/api'
import { getStatusColor, getPriorityColor, getDynamicColor } from '@/styles/dynamic-utils'
import { colors, spacing } from '@/styles/tokens'

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
  estimatedHours: number
  assignee: {
    id: string
    name: string
    email: string
  } | null
  project: {
    id: string
    name: string
    color: string
  }
  creator: {
    id: string
    name: string
    email: string
  }
  tags: string[]
  _count: {
    comments: number
  }
}

interface CreateTaskData {
  title: string
  description: string
  projectId: string
  assigneeId?: string
  status: string
  priority: string
  dueDate: string
  estimatedHours: number
  tags: string[]
}

const TasksPage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    projectId: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '',
    estimatedHours: 0,
    tags: []
  })

  const queryClient = useQueryClient()

  // Fetch tasks
  const { data: tasksData, isLoading, error } = useQuery<{ data: { tasks: Task[] } }>(
    ['tasks', selectedProject],
    () => api.get(`/api/tasks${selectedProject !== 'all' ? `?projectId=${selectedProject}` : ''}`).then(res => res.data)
  )

  // Fetch projects for dropdown
  const { data: projectsData } = useQuery<{ data: { projects: any[] } }>(
    'projects',
    () => api.get('/api/projects').then(res => res.data)
  )

  // Create task mutation
  const createTaskMutation = useMutation(
    (data: CreateTaskData) => api.post('/api/tasks', data).then(res => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks')
        toast.success('Task created successfully!')
        handleCloseDialog()
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to create task')
      }
    }
  )

  // Update task mutation
  const updateTaskMutation = useMutation(
    ({ id, data }: { id: string; data: CreateTaskData }) =>
      api.put(`/api/tasks/${id}`, data).then(res => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks')
        toast.success('Task updated successfully!')
        handleCloseDialog()
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update task')
      }
    }
  )

  // Delete task mutation
  const deleteTaskMutation = useMutation(
    (id: string) => api.delete(`/api/tasks/${id}`).then(res => res.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks')
        toast.success('Task deleted successfully!')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to delete task')
      }
    }
  )

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task)
      setFormData({
        title: task.title,
        description: task.description,
        projectId: task.project.id,
        assigneeId: task.assignee?.id,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        estimatedHours: task.estimatedHours,
        tags: task.tags
      })
    } else {
      setEditingTask(null)
      setFormData({
        title: '',
        description: '',
        projectId: '',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: '',
        estimatedHours: 0,
        tags: []
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingTask(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTask) {
      updateTaskMutation.mutate({ id: editingTask.id, data: formData })
    } else {
      createTaskMutation.mutate(formData)
    }
  }

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(id)
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'Urgent'
      case 'HIGH':
        return 'High'
      case 'MEDIUM':
        return 'Medium'
      case 'LOW':
        return 'Low'
      default:
        return priority
    }
  }

  const statusColumns = [
    { id: 'TODO', title: 'To Do', color: getDynamicColor('primary', '600') },
    { id: 'IN_PROGRESS', title: 'In Progress', color: getDynamicColor('warning', '500') },
    { id: 'COMPLETED', title: 'Completed', color: getDynamicColor('success', '500') }
  ]

  const tasks = tasksData?.data.tasks || []
  const projects = projectsData?.data.projects || []

  const groupedTasks = statusColumns.map(column => ({
    ...column,
    tasks: tasks.filter(task => task.status === column.id)
  }))

  const TaskCard = ({ task }: { task: Task }) => (
    <DynamicCard variant="default" className="mb-3 cursor-pointer hover:shadow-md transition-all duration-200">
      <DynamicCardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-sm leading-tight flex-1 mr-2" style={{ color: getDynamicColor('gray', '900') }}>
            {task.title}
          </h4>
          <DynamicButton
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id) }}
            className="h-6 w-6 p-0"
            style={{ color: getDynamicColor('error', '600') }}
          >
            <Trash2 className="h-3 w-3" />
          </DynamicButton>
        </div>
        
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <DynamicBadge
            variant="secondary"
            size="sm"
            style={{ backgroundColor: task.project.color, color: 'white' }}
          >
            {task.project.name}
          </DynamicBadge>
          <DynamicBadge
            variant="outline"
            size="sm"
            style={{ 
              backgroundColor: getPriorityColor(task.priority),
              color: 'white'
            }}
          >
            {getPriorityText(task.priority)}
          </DynamicBadge>
        </div>

        {task.assignee && (
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs">
                {task.assignee.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs" style={{ color: getDynamicColor('gray', '600') }}>
              {task.assignee.name}
            </span>
          </div>
        )}

        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs" style={{ color: getDynamicColor('gray', '600') }}>
            <Calendar className="h-3 w-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </DynamicCardContent>
    </DynamicCard>
  )

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {[1, 2, 3].map((column) => (
              <div key={column} className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <div className="space-y-3">
                  {[1, 2, 3].map((task) => (
                    <Skeleton key={task} className="h-24 w-full" />
                  ))}
                </div>
              </div>
            ))}
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
            <AlertDescription>Failed to load tasks</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: getDynamicColor('gray', '900') }}>Tasks</h1>
            <p style={{ color: getDynamicColor('gray', '600') }}>
              Manage and track your project tasks
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg" style={{ borderColor: getDynamicColor('gray', '200') }}>
              <DynamicButton
                variant={viewMode === 'kanban' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
                className="rounded-r-none"
              >
                <Columns className="h-4 w-4 mr-2" />
                Kanban
              </DynamicButton>
              <DynamicButton
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4 mr-2" />
                List
              </DynamicButton>
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <DynamicButton onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </DynamicButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingTask ? 'Edit Task' : 'Create New Task'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingTask ? 'Update task details below.' : 'Add a new task to your project.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter task title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter task description"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project">Project</Label>
                      <Select
                        value={formData.projectId}
                        onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => setFormData({ ...formData, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Low</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HIGH">High</SelectItem>
                          <SelectItem value="URGENT">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="TODO">To Do</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DynamicButton type="button" variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </DynamicButton>
                    <DynamicButton 
                      type="submit" 
                      disabled={createTaskMutation.isLoading || updateTaskMutation.isLoading}
                    >
                      {editingTask ? 'Update' : 'Create'}
                    </DynamicButton>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Project Filter */}
        <div className="flex items-center gap-4">
          <Label htmlFor="project-filter">Filter by Project:</Label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Kanban Board */}
        {viewMode === 'kanban' ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {groupedTasks.map((column) => (
              <div key={column.id} className="space-y-4">
                <DynamicCardHeader>
                  <DynamicCardTitle className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: column.color }}
                    />
                    {column.title}
                    <DynamicBadge variant="secondary" size="sm">
                      {column.tasks.length}
                    </DynamicBadge>
                  </DynamicCardTitle>
                </DynamicCardHeader>
                <div className="space-y-3">
                  {column.tasks.map((task) => (
                    <div key={task.id} onClick={() => handleOpenDialog(task)}>
                      <TaskCard task={task} />
                    </div>
                  ))}
                  {column.tasks.length === 0 && (
                    <div 
                      className="text-center py-8 text-sm"
                      style={{ color: getDynamicColor('gray', '500') }}
                    >
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} onClick={() => handleOpenDialog(task)}>
                <TaskCard task={task} />
              </div>
            ))}
            {tasks.length === 0 && (
              <DynamicCard variant="default">
                <DynamicCardContent className="text-center py-12">
                  <CheckSquare className="h-12 w-12 mx-auto mb-4" style={{ color: getDynamicColor('gray', '600') }} />
                  <h3 className="text-lg font-semibold mb-2" style={{ color: getDynamicColor('gray', '900') }}>No tasks yet</h3>
                  <p className="mb-6 max-w-md mx-auto" style={{ color: getDynamicColor('gray', '600') }}>
                    Create your first task to get started with task management
                  </p>
                  <DynamicButton onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </DynamicButton>
                </DynamicCardContent>
              </DynamicCard>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default TasksPage 