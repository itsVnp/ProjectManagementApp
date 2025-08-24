import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Menu, 
  Home,
  FolderOpen,
  Target,
  BarChart3,
  Calendar,
  Users,
  LogOut,
  Briefcase
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { useAuth } from '@/contexts/AuthContext'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Home className="h-4 w-4" />,
      href: '/dashboard',
      badge: null
    },
    {
      title: 'Projects',
      icon: <FolderOpen className="h-4 w-4" />,
      href: '/projects',
      badge: null
    },
    {
      title: 'Tasks',
      icon: <Target className="h-4 w-4" />,
      href: '/tasks',
      badge: '12'
    },
    {
      title: 'Analytics',
      icon: <BarChart3 className="h-4 w-4" />,
      href: '/analytics',
      badge: null
    },
    {
      title: 'Calendar',
      icon: <Calendar className="h-4 w-4" />,
      href: '/calendar',
      badge: null
    },
    {
      title: 'Team',
      icon: <Users className="h-4 w-4" />,
      href: '/team',
      badge: null
    }
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const renderSidebarContent = (isCollapsed: boolean = false) => (
    <div className={`flex flex-col h-full ${isCollapsed ? 'items-center py-6 space-y-6' : ''}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 ${isCollapsed ? 'w-8 h-8' : 'p-6 border-b border-gray-200/50'}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
          <Briefcase className="h-4 w-4 text-blue-600-foreground" />
        </div>
        {!isCollapsed && (
          <span className="font-semibold text-lg tracking-tight">Claro Admin</span>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className={`flex-1 ${isCollapsed ? 'space-y-2 w-full px-2' : 'p-4'}`}>
        <div className={isCollapsed ? '' : 'space-y-1'}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href
            
            if (isCollapsed) {
              return (
                <TooltipProvider key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className="w-10 h-10 p-0 mx-auto relative"
                        onClick={() => navigate(item.href)}
                      >
                        {item.icon}
                        {item.badge && (
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-sm">{item.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            }

            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 h-11 px-4 text-sm font-medium"
                onClick={() => navigate(item.href)}
              >
                <div className="flex-shrink-0">
                  {item.icon}
                </div>
                <span className="flex-1 text-left truncate">{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto flex-shrink-0 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className={`${isCollapsed ? '' : 'p-4 border-t border-gray-200/50'}`}>
        {isCollapsed ? (
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={(user as any)?.avatarUrl} />
            <AvatarFallback className="text-xs font-medium">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100/30">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={(user as any)?.avatarUrl} />
              <AvatarFallback className="text-xs font-medium">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'Administrator'}</p>
              <p className="text-xs text-gray-600 truncate">{user?.email}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex-shrink-0 h-8 w-8 p-0">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content with Sidebar */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`hidden md:block border-r border-gray-200/50 bg-gray-100/20 transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-16'}`}>
          <div className="sticky top-0 h-screen overflow-y-auto">
            {renderSidebarContent(!isSidebarOpen)}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen w-full">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout 