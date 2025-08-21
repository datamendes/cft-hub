import { formatDistanceToNow } from 'date-fns';
import { 
  Activity, 
  MessageSquare, 
  Edit, 
  CheckCircle, 
  Share, 
  AtSign, 
  FileText,
  Users,
  Calendar,
  GitBranch,
  Filter,
  Bell
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCollaboration, type Activity as ActivityType } from '@/hooks/use-collaboration';

const activityIcons = {
  comment: MessageSquare,
  edit: Edit,
  approval: CheckCircle,
  share: Share,
  mention: AtSign,
  status_change: GitBranch,
};

const activityColors = {
  comment: 'text-blue-600',
  edit: 'text-orange-600',
  approval: 'text-green-600',
  share: 'text-purple-600',
  mention: 'text-pink-600',
  status_change: 'text-gray-600',
};

const targetIcons = {
  document: FileText,
  proposal: Users,
  meeting: Calendar,
  workflow: GitBranch,
};

interface ActivityItemProps {
  activity: ActivityType;
}

function ActivityItem({ activity }: ActivityItemProps) {
  const ActivityIcon = activityIcons[activity.type];
  const TargetIcon = targetIcons[activity.target.type];
  
  return (
    <div className="flex items-start gap-3 p-4">
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarImage src={activity.user.avatar} />
          <AvatarFallback>
            {activity.user.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-background flex items-center justify-center border ${activityColors[activity.type]}`}>
          <ActivityIcon className="h-2.5 w-2.5" />
        </div>
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{activity.user.name}</span>
          <Badge variant="outline" className="text-xs">
            {activity.user.role}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
          </span>
        </div>
        
        <p className="text-sm text-foreground">{activity.description}</p>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TargetIcon className="h-3 w-3" />
            <span className="capitalize">{activity.target.type}</span>
          </div>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs font-medium">{activity.target.title}</span>
        </div>
      </div>
    </div>
  );
}

export function ActivityFeed() {
  const { getRecentActivities, users } = useCollaboration();
  const activities = getRecentActivities(20);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Activity Feed</h2>
          <p className="text-muted-foreground">
            Stay updated with team activities and collaboration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="mentions">Mentions</SelectItem>
              <SelectItem value="comments">Comments</SelectItem>
              <SelectItem value="approvals">Approvals</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Activity Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {activities.filter(a => a.type === 'comment').length}
                </p>
                <p className="text-sm text-muted-foreground">Comments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {activities.filter(a => a.type === 'edit').length}
                </p>
                <p className="text-sm text-muted-foreground">Edits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {activities.filter(a => a.type === 'approval').length}
                </p>
                <p className="text-sm text-muted-foreground">Approvals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.status === 'online').length}
                </p>
                <p className="text-sm text-muted-foreground">Online Now</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest updates from your team and projects
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
                <p className="text-muted-foreground">
                  Team activities will appear here as they happen
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {activities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Online Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Who's Online
          </CardTitle>
          <CardDescription>
            Team members currently active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {users
              .filter(user => user.status === 'online')
              .map((user) => (
                <div key={user.id} className="flex items-center gap-2 p-2 border rounded-lg">
                  <div className="relative">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-background" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </div>
              ))}
          </div>
          {users.filter(user => user.status === 'online').length === 0 && (
            <p className="text-sm text-muted-foreground">No team members online</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}