import { useState, useEffect } from 'react';
import { 
  Users, 
  Eye, 
  MousePointer, 
  Edit, 
  Play, 
  Pause,
  UserCheck,
  Clock,
  Activity
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCollaboration, type CollaborationSession } from '@/hooks/use-collaboration';

export function CollaborationPresence() {
  const { 
    collaborationSessions, 
    currentUser, 
    startCollaboration, 
    joinCollaboration,
    getOnlineUsers 
  } = useCollaboration();

  const [activeSessions, setActiveSessions] = useState<CollaborationSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const onlineUsers = getOnlineUsers();

  useEffect(() => {
    // Simulate active collaboration sessions
    const mockSessions: CollaborationSession[] = [
      {
        id: 'session-1',
        itemId: 'doc-1',
        itemType: 'document',
        participants: [
          { user: onlineUsers[0], cursor: { x: 250, y: 150 }, lastActivity: new Date() },
          { user: onlineUsers[1], cursor: { x: 180, y: 200 }, lastActivity: new Date(Date.now() - 30000) },
        ],
        isActive: true,
        startedAt: new Date(Date.now() - 1800000), // 30 minutes ago
      },
      {
        id: 'session-2',
        itemId: 'prop-1',
        itemType: 'proposal',
        participants: [
          { user: onlineUsers[0], lastActivity: new Date(Date.now() - 120000) },
        ],
        isActive: true,
        startedAt: new Date(Date.now() - 600000), // 10 minutes ago
      },
    ];
    setActiveSessions(mockSessions);
  }, [onlineUsers]);

  const handleStartSession = async () => {
    const session = await startCollaboration('demo-document', 'document');
    setActiveSessions(prev => [...prev, session]);
  };

  const handleJoinSession = async (sessionId: string) => {
    await joinCollaboration(sessionId);
    setSelectedSession(sessionId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Collaboration</h2>
          <p className="text-muted-foreground">
            Real-time collaboration and presence awareness
          </p>
        </div>
        <Button onClick={handleStartSession}>
          <Play className="mr-2 h-4 w-4" />
          Start New Session
        </Button>
      </div>

      {/* Collaboration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{activeSessions.length}</p>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{onlineUsers.length}</p>
                <p className="text-sm text-muted-foreground">Online Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {activeSessions.reduce((acc, s) => acc + s.participants.length, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {activeSessions.filter(s => s.participants.some(p => 
                    new Date().getTime() - p.lastActivity.getTime() < 60000
                  )).length}
                </p>
                <p className="text-sm text-muted-foreground">Recently Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active Collaboration Sessions
          </CardTitle>
          <CardDescription>
            Live collaboration sessions in progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeSessions.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No active sessions</h3>
              <p className="text-muted-foreground mb-4">
                Start a new collaboration session to work together in real-time
              </p>
              <Button onClick={handleStartSession}>
                <Play className="mr-2 h-4 w-4" />
                Start Collaboration
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activeSessions.map((session) => (
                <div 
                  key={session.id} 
                  className={`p-4 border rounded-lg transition-colors ${
                    selectedSession === session.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {session.itemType}
                        </Badge>
                        <span className="font-medium">Session {session.id}</span>
                        <Badge variant="secondary">
                          {session.participants.length} participant{session.participants.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Started {new Date(session.startedAt).toLocaleTimeString()}
                        </span>
                      </div>

                      {/* Participants */}
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {session.participants.map((participant) => (
                            <div key={participant.user.id} className="relative">
                              <Avatar className="h-6 w-6 border-2 border-background">
                                <AvatarImage src={participant.user.avatar} />
                                <AvatarFallback className="text-xs">
                                  {participant.user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              {new Date().getTime() - participant.lastActivity.getTime() < 60000 && (
                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-background" />
                              )}
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {session.participants.map(p => p.user.name).join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {session.participants.some(p => p.user.id === currentUser.id) ? (
                        <Badge variant="default">
                          <Eye className="h-3 w-3 mr-1" />
                          Joined
                        </Badge>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleJoinSession(session.id)}
                        >
                          Join Session
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Session Activity */}
                  {selectedSession === session.id && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <h4 className="text-sm font-medium">Live Activity</h4>
                      
                      {/* Simulated cursor positions */}
                      <div className="relative bg-muted/30 rounded-lg p-4 h-32 overflow-hidden">
                        <div className="text-xs text-muted-foreground mb-2">Document Preview</div>
                        {session.participants.map((participant, index) => (
                          participant.cursor && (
                            <div
                              key={participant.user.id}
                              className="absolute flex items-center gap-1"
                              style={{
                                left: `${(participant.cursor.x / 400) * 100}%`,
                                top: `${(participant.cursor.y / 200) * 100}%`,
                              }}
                            >
                              <MousePointer 
                                className="h-4 w-4" 
                                style={{ color: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'][index % 4] }}
                              />
                              <span 
                                className="text-xs px-1 py-0.5 rounded text-white"
                                style={{ backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'][index % 4] }}
                              >
                                {participant.user.name.split(' ')[0]}
                              </span>
                            </div>
                          )
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Last activity: {Math.max(...session.participants.map(p => 
                            new Date().getTime() - p.lastActivity.getTime()
                          )) < 60000 ? 'Just now' : '1 minute ago'}
                        </span>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3 mr-1" />
                          Start Editing
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Online Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Available for Collaboration
          </CardTitle>
          <CardDescription>
            Team members who can join collaboration sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {onlineUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-background" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600">
                  Online
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}