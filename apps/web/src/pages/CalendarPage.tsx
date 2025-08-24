import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
  Filter,
  Search
} from 'lucide-react'

import DynamicCard, { DynamicCardContent, DynamicCardDescription, DynamicCardHeader, DynamicCardTitle } from '@/components/ui/dynamic-card'
import DynamicButton from '@/components/ui/dynamic-button'
import DynamicBadge from '@/components/ui/dynamic-badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import DashboardLayout from '@/components/DashboardLayout'
import api from '@/services/api'
import { getDynamicColor } from '@/styles/dynamic-utils'
import { colors, spacing } from '@/styles/tokens'

interface CalendarEvent {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  location?: string
  attendees: string[]
  type: 'meeting' | 'deadline' | 'reminder' | 'task'
  priority: 'low' | 'medium' | 'high'
  project?: string
}

interface CalendarData {
  events: CalendarEvent[]
  upcomingEvents: CalendarEvent[]
  todayEvents: CalendarEvent[]
}

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedView, setSelectedView] = useState<'month' | 'week' | 'day'>('month')
  const [filterType, setFilterType] = useState<string>('all')

  // Fetch calendar data
  const { data: calendarData, isLoading } = useQuery<{ data: CalendarData }>(
    'calendar-data',
    () => api.get('/api/calendar').then(res => res.data),
    {
      refetchInterval: 30000,
    }
  )

  const data = calendarData?.data || {
    events: [],
    upcomingEvents: [],
    todayEvents: []
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const getEventsForDate = (date: Date) => {
    if (!date) return []
    const dateStr = date.toISOString().split('T')[0]
    return data.events.filter(event => 
      event.startDate.startsWith(dateStr) || 
      (event.endDate && event.endDate.startsWith(dateStr))
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return getDynamicColor('error', '500')
      case 'medium':
        return getDynamicColor('warning', '500')
      case 'low':
        return getDynamicColor('success', '500')
      default:
        return getDynamicColor('gray', '500')
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return { bg: getDynamicColor('primary', '100'), text: getDynamicColor('primary', '800') }
      case 'deadline':
        return { bg: getDynamicColor('error', '100'), text: getDynamicColor('error', '800') }
      case 'reminder':
        return { bg: getDynamicColor('warning', '100'), text: getDynamicColor('warning', '800') }
      case 'task':
        return { bg: getDynamicColor('success', '100'), text: getDynamicColor('success', '800') }
      default:
        return { bg: getDynamicColor('gray', '100'), text: getDynamicColor('gray', '800') }
    }
  }

  const EventCard = ({ event }: { event: CalendarEvent }) => {
    const typeColors = getTypeColor(event.type)
    
    return (
      <DynamicCard variant="default" className="mb-3">
        <DynamicCardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <DynamicCardTitle className="text-sm font-medium">{event.title}</DynamicCardTitle>
            <DynamicBadge 
              variant="secondary" 
              size="sm"
              style={{ backgroundColor: typeColors.bg, color: typeColors.text }}
            >
              {event.type}
            </DynamicBadge>
          </div>
          <DynamicCardDescription className="text-xs">
            {new Date(event.startDate).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </DynamicCardDescription>
        </DynamicCardHeader>
        <DynamicCardContent className="pt-0">
          <p className="text-xs mb-2" style={{ color: getDynamicColor('gray', '600') }}>{event.description}</p>
          <div className="flex items-center gap-2 text-xs" style={{ color: getDynamicColor('gray', '600') }}>
            {event.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{event.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{event.attendees.length} attendees</span>
            </div>
          </div>
        </DynamicCardContent>
      </DynamicCard>
    )
  }

  const CalendarDay = ({ date, events }: { date: Date | null, events: CalendarEvent[] }) => {
    const isToday = date && date.toDateString() === new Date().toDateString()
    const isCurrentMonth = date && date.getMonth() === currentDate.getMonth()
    
    return (
      <div 
        className="min-h-[120px] p-2 border"
        style={{
          borderColor: getDynamicColor('gray', '200'),
          backgroundColor: isToday 
            ? getDynamicColor('primary', '50') 
            : !isCurrentMonth 
              ? getDynamicColor('gray', '50') 
              : 'white',
          color: !isCurrentMonth ? getDynamicColor('gray', '400') : getDynamicColor('gray', '900')
        }}
      >
        {date && (
          <>
            <div className="text-sm font-medium mb-1">
              {date.getDate()}
            </div>
            <div className="space-y-1">
              {events.slice(0, 2).map((event, index) => {
                const typeColors = getTypeColor(event.type)
                return (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded truncate cursor-pointer"
                    style={{ 
                      backgroundColor: typeColors.bg, 
                      color: typeColors.text 
                    }}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                )
              })}
              {events.length > 2 && (
                <div className="text-xs" style={{ color: getDynamicColor('gray', '500') }}>
                  +{events.length - 2} more
                </div>
              )}
            </div>
          </>
        )}
      </div>
    )
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const filteredEvents = filterType === 'all' 
    ? data.events 
    : data.events.filter(event => event.type === filterType)

  const days = getDaysInMonth(currentDate)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: getDynamicColor('gray', '900') }}>Calendar</h1>
            <p style={{ color: getDynamicColor('gray', '600') }}>
              Manage your schedule and upcoming events
            </p>
          </div>
          <DynamicButton>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </DynamicButton>
        </div>

        {/* Calendar Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <DynamicButton
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </DynamicButton>
              <h2 className="text-lg font-semibold" style={{ color: getDynamicColor('gray', '900') }}>
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <DynamicButton
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </DynamicButton>
            </div>
            <div className="flex items-center border rounded-lg" style={{ borderColor: getDynamicColor('gray', '200') }}>
              <DynamicButton
                variant={selectedView === 'month' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedView('month')}
                className="rounded-r-none"
              >
                Month
              </DynamicButton>
              <DynamicButton
                variant={selectedView === 'week' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedView('week')}
                className="rounded-l-none rounded-r-none"
              >
                Week
              </DynamicButton>
              <DynamicButton
                variant={selectedView === 'day' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedView('day')}
                className="rounded-l-none"
              >
                Day
              </DynamicButton>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="meeting">Meetings</SelectItem>
                <SelectItem value="deadline">Deadlines</SelectItem>
                <SelectItem value="reminder">Reminders</SelectItem>
                <SelectItem value="task">Tasks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {/* Day Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div 
              key={day} 
              className="p-3 text-center font-medium text-sm"
              style={{ 
                backgroundColor: 'white',
                color: getDynamicColor('gray', '700')
              }}
            >
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {days.map((date, index) => (
            <CalendarDay 
              key={index} 
              date={date} 
              events={date ? getEventsForDate(date) : []} 
            />
          ))}
        </div>

        {/* Upcoming Events */}
        <div className="grid gap-6 md:grid-cols-2">
          <DynamicCard variant="default">
            <DynamicCardHeader>
              <DynamicCardTitle>Today's Events</DynamicCardTitle>
              <DynamicCardDescription>
                {data.todayEvents.length} events scheduled for today
              </DynamicCardDescription>
            </DynamicCardHeader>
            <DynamicCardContent>
              <div className="space-y-3">
                {data.todayEvents.length === 0 ? (
                  <p className="text-sm" style={{ color: getDynamicColor('gray', '500') }}>
                    No events scheduled for today
                  </p>
                ) : (
                  data.todayEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                )}
              </div>
            </DynamicCardContent>
          </DynamicCard>

          <DynamicCard variant="default">
            <DynamicCardHeader>
              <DynamicCardTitle>Upcoming Events</DynamicCardTitle>
              <DynamicCardDescription>
                {data.upcomingEvents.length} events in the next 7 days
              </DynamicCardDescription>
            </DynamicCardHeader>
            <DynamicCardContent>
              <div className="space-y-3">
                {data.upcomingEvents.length === 0 ? (
                  <p className="text-sm" style={{ color: getDynamicColor('gray', '500') }}>
                    No upcoming events
                  </p>
                ) : (
                  data.upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))
                )}
              </div>
            </DynamicCardContent>
          </DynamicCard>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CalendarPage 