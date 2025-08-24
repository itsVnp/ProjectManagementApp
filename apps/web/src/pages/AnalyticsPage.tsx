import React from 'react'
import { useQuery } from 'react-query'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  Target,
  Calendar,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart,
  BarChart
} from 'lucide-react'

import DynamicCard, { DynamicCardContent, DynamicCardDescription, DynamicCardHeader, DynamicCardTitle } from '@/components/ui/dynamic-card'
import DynamicBadge from '@/components/ui/dynamic-badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import DashboardLayout from '@/components/DashboardLayout'
import api from '@/services/api'
import { getDynamicColor } from '@/styles/dynamic-utils'
import { colors, spacing } from '@/styles/tokens'

interface AnalyticsData {
  projectPerformance: {
    name: string
    completed: number
    total: number
    completionRate: number
  }[]
  taskTrends: {
    date: string
    completed: number
    created: number
  }[]
  teamProductivity: {
    member: string
    tasksCompleted: number
    avgCompletionTime: number
    efficiency: number
  }[]
  timeDistribution: {
    category: string
    hours: number
    percentage: number
  }[]
}

const AnalyticsPage: React.FC = () => {
  // Fetch analytics data
  const { data: analyticsData, isLoading } = useQuery<{ data: AnalyticsData }>(
    'analytics-data',
    () => api.get('/api/analytics').then(res => res.data),
    {
      refetchInterval: 60000, // Refresh every minute
    }
  )

  const data = analyticsData?.data || {
    projectPerformance: [],
    taskTrends: [],
    teamProductivity: [],
    timeDistribution: []
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
    <DynamicCard variant="default">
      <DynamicCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <DynamicCardTitle className="text-sm font-medium">{title}</DynamicCardTitle>
        <div className="h-4 w-4" style={{ color: getDynamicColor('gray', '500') }}>{icon}</div>
      </DynamicCardHeader>
      <DynamicCardContent>
        <div className="text-2xl font-bold" style={{ color: getDynamicColor('gray', '900') }}>{value}</div>
        {subtitle && (
          <p className="text-xs" style={{ color: getDynamicColor('gray', '500') }}>{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center pt-1">
            {trend === 'up' ? (
              <ArrowUpRight className="h-3 w-3" style={{ color: getDynamicColor('success', '600') }} />
            ) : (
              <ArrowDownRight className="h-3 w-3" style={{ color: getDynamicColor('error', '600') }} />
            )}
            <span className="text-xs" style={{ color: trend === 'up' ? getDynamicColor('success', '600') : getDynamicColor('error', '600') }}>
              {trendValue}
            </span>
          </div>
        )}
      </DynamicCardContent>
    </DynamicCard>
  )

  const ProjectPerformanceCard = ({ project }: { project: AnalyticsData['projectPerformance'][0] }) => (
    <DynamicCard variant="default">
      <DynamicCardHeader>
        <DynamicCardTitle className="text-sm">{project.name}</DynamicCardTitle>
        <DynamicCardDescription>
          {project.completed} of {project.total} tasks completed
        </DynamicCardDescription>
      </DynamicCardHeader>
      <DynamicCardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span style={{ color: getDynamicColor('gray', '600') }}>Completion Rate</span>
            <span className="font-medium" style={{ color: getDynamicColor('gray', '900') }}>{project.completionRate}%</span>
          </div>
          <Progress value={project.completionRate} className="h-2" />
        </div>
      </DynamicCardContent>
    </DynamicCard>
  )

  const TeamMemberCard = ({ member }: { member: AnalyticsData['teamProductivity'][0] }) => (
    <DynamicCard variant="default">
      <DynamicCardHeader>
        <DynamicCardTitle className="text-sm">{member.member}</DynamicCardTitle>
        <DynamicCardDescription>
          {member.tasksCompleted} tasks completed
        </DynamicCardDescription>
      </DynamicCardHeader>
      <DynamicCardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span style={{ color: getDynamicColor('gray', '600') }}>Avg. Completion Time</span>
            <span className="font-medium" style={{ color: getDynamicColor('gray', '900') }}>{member.avgCompletionTime}h</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: getDynamicColor('gray', '600') }}>Efficiency</span>
            <span className="font-medium" style={{ color: getDynamicColor('gray', '900') }}>{member.efficiency}%</span>
          </div>
          <Progress value={member.efficiency} className="h-2" />
        </div>
      </DynamicCardContent>
    </DynamicCard>
  )

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: getDynamicColor('gray', '900') }}>Analytics</h1>
            <p style={{ color: getDynamicColor('gray', '600') }}>
              Track performance, productivity, and project insights
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Projects"
            value={data.projectPerformance.length}
            icon={<BarChart3 className="h-4 w-4" />}
            trend="up"
            trendValue="12%"
            subtitle="vs last month"
          />
          <StatCard
            title="Task Completion Rate"
            value="87%"
            icon={<Target className="h-4 w-4" />}
            trend="up"
            trendValue="5%"
            subtitle="vs last month"
          />
          <StatCard
            title="Team Productivity"
            value="92%"
            icon={<Users className="h-4 w-4" />}
            trend="up"
            trendValue="8%"
            subtitle="vs last month"
          />
          <StatCard
            title="Time Efficiency"
            value="78%"
            icon={<Activity className="h-4 w-4" />}
            trend="down"
            trendValue="3%"
            subtitle="vs last month"
          />
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="projects" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="time">Time</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.projectPerformance.map((project, index) => (
                <ProjectPerformanceCard key={index} project={project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="productivity" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.teamProductivity.map((member, index) => (
                <TeamMemberCard key={index} member={member} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <DynamicCard variant="default">
              <DynamicCardHeader>
                <DynamicCardTitle>Task Trends</DynamicCardTitle>
                <DynamicCardDescription>
                  Task completion and creation trends over time
                </DynamicCardDescription>
              </DynamicCardHeader>
              <DynamicCardContent>
                <div className="h-[300px] flex items-center justify-center" style={{ backgroundColor: getDynamicColor('gray', '50') }}>
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto mb-4" style={{ color: getDynamicColor('gray', '400') }} />
                    <p style={{ color: getDynamicColor('gray', '600') }}>Chart visualization would go here</p>
                  </div>
                </div>
              </DynamicCardContent>
            </DynamicCard>
          </TabsContent>

          <TabsContent value="time" className="space-y-4">
            <DynamicCard variant="default">
              <DynamicCardHeader>
                <DynamicCardTitle>Time Distribution</DynamicCardTitle>
                <DynamicCardDescription>
                  How time is spent across different categories
                </DynamicCardDescription>
              </DynamicCardHeader>
              <DynamicCardContent>
                <div className="space-y-4">
                  {data.timeDistribution.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: getDynamicColor('gray', '600') }}>{item.category}</span>
                        <span className="font-medium" style={{ color: getDynamicColor('gray', '900') }}>
                          {item.hours}h ({item.percentage}%)
                        </span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </DynamicCardContent>
            </DynamicCard>
          </TabsContent>
        </Tabs>

        {/* Quick Insights */}
        <div className="grid gap-4 md:grid-cols-2">
          <DynamicCard variant="default">
            <DynamicCardHeader>
              <DynamicCardTitle>Top Performers</DynamicCardTitle>
              <DynamicCardDescription>
                Team members with highest productivity
              </DynamicCardDescription>
            </DynamicCardHeader>
            <DynamicCardContent>
              <div className="space-y-3">
                {data.teamProductivity
                  .sort((a, b) => b.efficiency - a.efficiency)
                  .slice(0, 3)
                  .map((member, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                          style={{ backgroundColor: getDynamicColor('primary', '600') }}
                        >
                          {member.member.charAt(0)}
                        </div>
                        <span className="font-medium" style={{ color: getDynamicColor('gray', '900') }}>
                          {member.member}
                        </span>
                      </div>
                      <DynamicBadge variant="success" size="sm">
                        {member.efficiency}%
                      </DynamicBadge>
                    </div>
                  ))}
              </div>
            </DynamicCardContent>
          </DynamicCard>

          <DynamicCard variant="default">
            <DynamicCardHeader>
              <DynamicCardTitle>Recent Activity</DynamicCardTitle>
              <DynamicCardDescription>
                Latest project and task updates
              </DynamicCardDescription>
            </DynamicCardHeader>
            <DynamicCardContent>
              <div className="space-y-3">
                {data.taskTrends.slice(-5).map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium" style={{ color: getDynamicColor('gray', '900') }}>
                        {trend.completed} tasks completed
                      </p>
                      <p className="text-xs" style={{ color: getDynamicColor('gray', '500') }}>
                        {new Date(trend.date).toLocaleDateString()}
                      </p>
                    </div>
                    <DynamicBadge variant="primary" size="sm">
                      +{trend.created} new
                    </DynamicBadge>
                  </div>
                ))}
              </div>
            </DynamicCardContent>
          </DynamicCard>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AnalyticsPage 