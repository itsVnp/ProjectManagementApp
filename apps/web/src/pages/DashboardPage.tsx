import React from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { 
  BarChart3, 
  CheckSquare, 
  Clock, 
  FileText, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/services/api';
import { getStatusColor, getDynamicColor } from '@/styles/dynamic-utils';
import { colors, spacing } from '@/styles/tokens';

interface DashboardStats {
  totalProjects: number
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  upcomingTasks: number
  completionRate: number
}

interface RecentTask {
  id: string
  title: string
  status: string
  priority: string
  dueDate: string
  project: {
    name: string
    color: string
  }
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()

  // Fetch dashboard stats
  const { data: statsData } = useQuery<{ data: DashboardStats }>(
    'dashboard-stats',
    () => api.get('/api/dashboard/stats').then(res => res.data),
    {
      refetchInterval: 30000,
    }
  )

  // Fetch recent tasks
  const { data: tasksData, isLoading: tasksLoading } = useQuery<{ data: { tasks: RecentTask[] } }>(
    'recent-tasks',
    () => api.get('/api/tasks?limit=5').then(res => res.data),
    {
      refetchInterval: 30000,
    }
  )

  const stats = statsData?.data || {
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    upcomingTasks: 0,
    completionRate: 0
  }

  const recentTasks = tasksData?.data.tasks || []

  const getStatusColorClass = (status: string) => {
    return getStatusColor(status).bg;
  }

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    trend, 
    trendValue, 
    subtitle,
    color = 'primary'
  }: {
    title: string
    value: string | number
    icon: React.ReactNode
    trend?: 'up' | 'down'
    trendValue?: string
    subtitle?: string
    color?: string
  }) => (
    <Card className="group hover:shadow-md transition-all duration-200 border-gray-200/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div 
              className={`p-3 rounded-lg group-hover:scale-105 transition-transform duration-200 flex-shrink-0`}
              style={{ 
                backgroundColor: color === 'primary' 
                  ? getDynamicColor('primary', '100') 
                  : getDynamicColor(color as string, '100') 
              }}
            >
              {icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl font-bold tracking-tight leading-none">{value}</p>
              {subtitle && (
                <p className="text-xs text-gray-600 mt-2">{subtitle}</p>
              )}
            </div>
          </div>
          {trend && trendValue && (
            <div className={`flex items-center space-x-1 text-sm font-medium flex-shrink-0 ${
              trend === 'up' ? 'text-success-600' : 'text-error-600'
            }`}>
              {trend === 'up' ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const TaskCard = ({ task }: { task: RecentTask }) => (
    <div className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200/50 bg-white hover:bg-gray-100/30 transition-colors duration-200">
      <div 
        className="w-2 h-2 rounded-full flex-shrink-0" 
        style={{ backgroundColor: getDynamicColor(getStatusColor(task.status).bg.replace('bg-', '').split('-')[0], getStatusColor(task.status).bg.replace('bg-', '').split('-')[1]) }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-none truncate mb-1">{task.title}</p>
        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
          <Badge variant="outline" className="text-xs border-gray-200/50">
            {task.project.name}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {task.priority}
          </Badge>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-xs text-gray-600">
          {new Date(task.dueDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  )

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your projects.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={<FileText className="h-5 w-5 text-primary-600" />}
            trend="up"
            trendValue="+12%"
            subtitle="from last month"
          />
          <StatCard
            title="Total Tasks"
            value={stats.totalTasks}
            icon={<CheckSquare className="h-5 w-5 text-success-600" />}
            trend="up"
            trendValue="+8%"
            subtitle="from last month"
          />
          <StatCard
            title="Completed Tasks"
            value={stats.completedTasks}
            icon={<TrendingUp className="h-5 w-5 text-success-600" />}
            subtitle={`${stats.completionRate}% completion rate`}
          />
          <StatCard
            title="Overdue Tasks"
            value={stats.overdueTasks}
            icon={<AlertTriangle className="h-5 w-5 text-error-600" />}
            trend="down"
            trendValue="-5%"
            subtitle="from last month"
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Tasks */}
          <Card className="border-gray-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Tasks</h2>
                <button 
                  onClick={() => navigate('/tasks')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View all
                </button>
              </div>
              
              {tasksLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent tasks</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-gray-200/50">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/projects/new')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary-100 group-hover:bg-primary-200 transition-colors duration-200">
                      <FileText className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Create New Project</h3>
                      <p className="text-sm text-gray-600">Start a new project from scratch</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/tasks/new')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-success-100 group-hover:bg-success-200 transition-colors duration-200">
                      <CheckSquare className="h-5 w-5 text-success-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Add New Task</h3>
                      <p className="text-sm text-gray-600">Create a new task for your team</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/team')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-info-100 group-hover:bg-info-200 transition-colors duration-200">
                      <Users className="h-5 w-5 text-info-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Manage Team</h3>
                      <p className="text-sm text-gray-600">View and manage team members</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/calendar')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-warning-100 group-hover:bg-warning-200 transition-colors duration-200">
                      <Calendar className="h-5 w-5 text-warning-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">View Calendar</h3>
                      <p className="text-sm text-gray-600">Check your schedule and deadlines</p>
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage 