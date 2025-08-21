import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, X, Filter, Settings, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useNotifications, type Notification } from '@/hooks/use-notifications';

const notificationIcons = {
  info: '📄',
  success: '✅',
  warning: '⚠️',
  error: '❌',
};

const categoryColors = {
  document: 'bg-blue-500/10 text-blue-600 border-blue-200',
  proposal: 'bg-green-500/10 text-green-600 border-green-200',
  meeting: 'bg-orange-500/10 text-orange-600 border-orange-200',
  workflow: 'bg-purple-500/10 text-purple-600 border-purple-200',
  system: 'bg-gray-500/10 text-gray-600 border-gray-200',
};

const priorityColors = {
  low: 'border-l-gray-300',
  medium: 'border-l-orange-400',
  high: 'border-l-red-500',
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  return (
    <div
      className={`p-4 border-l-4 ${priorityColors[notification.priority]} ${
        notification.read ? 'bg-muted/30' : 'bg-background'
      } hover:bg-muted/50 transition-colors`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="text-lg mt-1">
            {notificationIcons[notification.type]}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h4 className={`text-sm font-medium ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                {notification.title}
              </h4>
              <Badge variant="outline" className={`text-xs ${categoryColors[notification.category]}`}>
                {notification.category}
              </Badge>
              {notification.priority === 'high' && (
                <Badge variant="destructive" className="text-xs">
                  High Priority
                </Badge>
              )}
            </div>
            <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground/80'}`}>
              {notification.message}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
              </span>
              {notification.actionUrl && (
                <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                  {notification.actionLabel || 'View'}
                </Button>
              )}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!notification.read && (
              <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
                <Check className="mr-2 h-4 w-4" />
                Mark as read
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDelete(notification.id)} className="text-destructive">
              <X className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function NotificationCenter() {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadCount,
    getFilteredNotifications,
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | 'high-priority'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const getFilteredNotifs = () => {
    let filtered = notifications;

    switch (filter) {
      case 'unread':
        filtered = getFilteredNotifications({ read: false });
        break;
      case 'high-priority':
        filtered = getFilteredNotifications({ priority: 'high' });
        break;
      default:
        filtered = notifications;
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(notif => notif.category === categoryFilter);
    }

    return filtered;
  };

  const unreadCount = getUnreadCount();
  const filteredNotifications = getFilteredNotifs();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Notifications</h3>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-3 w-3 mr-1" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  All notifications
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('unread')}>
                  Unread only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('high-priority')}>
                  High priority
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
                  All categories
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter('document')}>
                  Documents
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter('proposal')}>
                  Proposals
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter('meeting')}>
                  Meetings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter('workflow')}>
                  Workflows
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mx-4 mt-2">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="mt-0">
            <ScrollArea className="h-96">
              {filteredNotifications.length > 0 ? (
                <div className="space-y-1">
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications found</p>
                  <p className="text-xs mt-1">You're all caught up!</p>
                </div>
              )}
            </ScrollArea>
            
            {notifications.length > 0 && (
              <div className="p-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearAllNotifications}
                  className="w-full"
                >
                  Clear all notifications
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email notifications</span>
                  <Button variant="outline" size="sm">
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">In-app notifications</span>
                  <Button variant="outline" size="sm">
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Categories</h4>
                  {Object.keys(categoryColors).map((category) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{category}</span>
                      <Badge variant="outline" className={categoryColors[category as keyof typeof categoryColors]}>
                        Enabled
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}