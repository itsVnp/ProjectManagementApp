import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { 
  Users,
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Target,
  Award,
  Clock,
  Star,
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus
} from 'lucide-react'

import DynamicCard, { DynamicCardContent, DynamicCardDescription, DynamicCardHeader, DynamicCardTitle } from '@/components/ui/dynamic-card'
import DynamicButton from '@/components/ui/dynamic-button'
import DynamicBadge from '@/components/ui/dynamic-badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import DashboardLayout from '@/components/DashboardLayout'
import api from '@/services/api'
import { getStatusColor, getRoleColor, getDynamicColor } from '@/styles/dynamic-utils'
import { colors, spacing } from '@/styles/tokens'

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  avatarUrl?: string
  status: 'active' | 'inactive' | 'away'
  joinDate: string
  lastActive: string
  phone?: string
  location?: string
  skills: string[]
  projects: number
  tasksCompleted: number
  performance: number
  availability: number
}

interface TeamData {
  members: TeamMember[]
  departments: string[]
  roles: string[]
  stats: {
    totalMembers: number
    activeMembers: number
    averagePerformance: number
    totalProjects: number
  }
}

const TeamPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState<string>('all')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Fetch team data
  const { data: teamData, isLoading } = useQuery<{ data: TeamData }>(
    'team-data',
    () => api.get('/api/team').then(res => res.data),
    {
      refetchInterval: 30000,
    }
  )

  const data = teamData?.data || {
    members: [],
    departments: [],
    roles: [],
    stats: {
      totalMembers: 0,
      activeMembers: 0,
      averagePerformance: 0,
      totalProjects: 0
    }
  }

  const filteredMembers = data.members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment
    const matchesRole = filterRole === 'all' || member.role === filterRole
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus
    
    return matchesSearch && matchesDepartment && matchesRole && matchesStatus
  })

  const MemberCard = ({ member }: { member: TeamMember }) => {
    const statusColors = getStatusColor(member.status)
    const roleColors = getRoleColor(member.role)
    
    return (
      <DynamicCard variant="default">
        <DynamicCardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.avatarUrl} />
                <AvatarFallback className="text-lg font-medium">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <DynamicCardTitle className="text-lg">{member.name}</DynamicCardTitle>
                <DynamicCardDescription className="flex items-center gap-1">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getDynamicColor(statusColors.bg.replace('bg-', '').split('-')[0], statusColors.bg.replace('bg-', '').split('-')[1]) }}
                  />
                  {member.status}
                </DynamicCardDescription>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <DynamicButton variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </DynamicButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </DropdownMenuItem>
                <DropdownMenuItem style={{ color: getDynamicColor('error', '600') }}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DynamicCardHeader>
        <DynamicCardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <DynamicBadge 
              variant="secondary"
              size="sm"
              style={{ backgroundColor: roleColors.bg, color: roleColors.text }}
            >
              {member.role}
            </DynamicBadge>
            <span className="text-sm" style={{ color: getDynamicColor('gray', '500') }}>{member.department}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm" style={{ color: getDynamicColor('gray', '500') }}>
              <Mail className="h-3 w-3" />
              <span>{member.email}</span>
            </div>
            {member.phone && (
              <div className="flex items-center gap-2 text-sm" style={{ color: getDynamicColor('gray', '500') }}>
                <Phone className="h-3 w-3" />
                <span>{member.phone}</span>
              </div>
            )}
            {member.location && (
              <div className="flex items-center gap-2 text-sm" style={{ color: getDynamicColor('gray', '500') }}>
                <MapPin className="h-3 w-3" />
                <span>{member.location}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: getDynamicColor('gray', '600') }}>Performance</span>
              <span className="font-medium" style={{ color: getDynamicColor('gray', '900') }}>{member.performance}%</span>
            </div>
            <Progress value={member.performance} className="h-2" />
            
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: getDynamicColor('gray', '600') }}>Availability</span>
              <span className="font-medium" style={{ color: getDynamicColor('gray', '900') }}>{member.availability}%</span>
            </div>
            <Progress value={member.availability} className="h-2" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3" style={{ color: getDynamicColor('gray', '500') }} />
              <span style={{ color: getDynamicColor('gray', '600') }}>{member.projects} projects</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="h-3 w-3" style={{ color: getDynamicColor('gray', '500') }} />
              <span style={{ color: getDynamicColor('gray', '600') }}>{member.tasksCompleted} tasks</span>
            </div>
          </div>

          {member.skills.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm font-medium" style={{ color: getDynamicColor('gray', '700') }}>Skills</span>
              <div className="flex flex-wrap gap-1">
                {member.skills.slice(0, 3).map((skill, index) => (
                  <DynamicBadge key={index} variant="outline" size="sm">
                    {skill}
                  </DynamicBadge>
                ))}
                {member.skills.length > 3 && (
                  <DynamicBadge variant="outline" size="sm">
                    +{member.skills.length - 3} more
                  </DynamicBadge>
                )}
              </div>
            </div>
          )}
        </DynamicCardContent>
      </DynamicCard>
    )
  }

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    subtitle,
    color = 'primary'
  }: {
    title: string
    value: string | number
    icon: React.ReactNode
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
      </DynamicCardContent>
    </DynamicCard>
  )

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: getDynamicColor('gray', '900') }}>Team</h1>
            <p style={{ color: getDynamicColor('gray', '600') }}>
              Manage your team members and their performance
            </p>
          </div>
          <DynamicButton>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </DynamicButton>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Members"
            value={data.stats.totalMembers}
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard
            title="Active Members"
            value={data.stats.activeMembers}
            icon={<Target className="h-4 w-4" />}
          />
          <StatCard
            title="Avg Performance"
            value={`${data.stats.averagePerformance}%`}
            icon={<Award className="h-4 w-4" />}
          />
          <StatCard
            title="Total Projects"
            value={data.stats.totalProjects}
            icon={<Calendar className="h-4 w-4" />}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: getDynamicColor('gray', '400') }} />
              <Input
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {data.departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {data.roles.map((role) => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="away">Away</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <DynamicCard variant="default">
            <DynamicCardContent className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4" style={{ color: getDynamicColor('gray', '600') }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: getDynamicColor('gray', '900') }}>No team members found</h3>
              <p className="mb-6 max-w-md mx-auto" style={{ color: getDynamicColor('gray', '600') }}>
                {searchTerm || filterDepartment !== 'all' || filterRole !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Add your first team member to get started'
                }
              </p>
              <DynamicButton>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Team Member
              </DynamicButton>
            </DynamicCardContent>
          </DynamicCard>
        )}
      </div>
    </DashboardLayout>
  )
}

export default TeamPage 