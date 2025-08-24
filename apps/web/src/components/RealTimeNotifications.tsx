import React, { useState, useEffect } from 'react';
import { Bell, Info, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const RealTimeNotifications: React.FC = () => {
  const { lastMessage, isConnected } = useWebSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (lastMessage) {
      const newNotification = createNotification(lastMessage);
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep last 10
      setOpen(true);
    }
  }, [lastMessage]);

  const createNotification = (message: any): Notification => {
    const now = new Date();
    let title = '';
    let notificationMessage = '';

    switch (message.type) {
      case 'task:created':
        title = 'New Task Created';
        notificationMessage = `Task "${message.data.title}" has been created`;
        break;
      case 'task:updated':
        title = 'Task Updated';
        notificationMessage = `Task "${message.data.title}" has been updated`;
        break;
      case 'task:deleted':
        title = 'Task Deleted';
        notificationMessage = `Task "${message.data.title}" has been deleted`;
        break;
      case 'project:created':
        title = 'New Project Created';
        notificationMessage = `Project "${message.data.name}" has been created`;
        break;
      case 'project:updated':
        title = 'Project Updated';
        notificationMessage = `Project "${message.data.name}" has been updated`;
        break;
      case 'project:deleted':
        title = 'Project Deleted';
        notificationMessage = `Project "${message.data.name}" has been deleted`;
        break;
      case 'comment:added':
        title = 'New Comment';
        notificationMessage = `New comment added to task "${message.data.taskTitle}"`;
        break;
      case 'notification':
        title = message.data.title || 'Notification';
        notificationMessage = message.data.message || 'You have a new notification';
        break;
      default:
        title = 'Update';
        notificationMessage = 'Something has been updated';
    }

    return {
      id: `${Date.now()}-${Math.random()}`,
      type: message.type,
      title,
      message: notificationMessage,
      timestamp: now,
      read: false,
    };
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task:created':
      case 'task:updated':
      case 'task:deleted':
        return <Info className="h-4 w-4" />;
      case 'project:created':
      case 'project:updated':
      case 'project:deleted':
        return <CheckCircle className="h-4 w-4" />;
      case 'comment:added':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationVariant = (type: string) => {
    switch (type) {
      case 'task:created':
      case 'project:created':
        return 'default';
      case 'task:updated':
      case 'project:updated':
        return 'default';
      case 'task:deleted':
      case 'project:deleted':
        return 'destructive';
      case 'comment:added':
        return 'default';
      default:
        return 'default';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed top-5 right-5 z-50 space-y-2">
      {/* Connection Status */}
      <Badge 
        variant={isConnected ? 'default' : 'destructive'}
        className="text-xs"
      >
        <Bell className="h-3 w-3 mr-1" />
        {isConnected ? 'Connected' : 'Disconnected'}
      </Badge>

      {/* Notification Bell */}
      <Collapsible open={expanded} onOpenChange={setExpanded}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="relative h-10 w-10 p-0 bg-white shadow-md hover:shadow-lg"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="absolute top-12 right-0 w-80">
          <Card className="shadow-xl border-gray-200/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-80">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 cursor-pointer transition-colors ${
                          notification.read 
                            ? 'bg-transparent' 
                            : 'bg-gray-100/50'
                        } hover:bg-gray-100/80 border-b border-gray-200/50 last:border-b-0`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium leading-tight mb-1">
                              {notification.title}
                            </h4>
                            <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-600">
                              {notification.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Toast Notification */}
      {open && lastMessage && (
        <Alert 
          variant={getNotificationVariant(lastMessage.type || 'info')}
          className="w-80 shadow-lg"
        >
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 mt-0.5">
              {getNotificationIcon(lastMessage.type)}
            </div>
            <div className="flex-1">
              <AlertDescription className="font-medium">
                {createNotification(lastMessage).title}
              </AlertDescription>
              <AlertDescription className="text-xs mt-1">
                {createNotification(lastMessage).message}
              </AlertDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 flex-shrink-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default RealTimeNotifications; 