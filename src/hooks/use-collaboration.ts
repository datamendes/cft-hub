import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'reviewer' | 'contributor' | 'viewer';
  status: 'online' | 'away' | 'offline';
  lastSeen: Date;
  department?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt?: Date;
  replies?: Comment[];
  mentions?: string[];
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  resolved?: boolean;
  resolvedBy?: User;
  resolvedAt?: Date;
  reactions?: Array<{
    emoji: string;
    users: User[];
    count: number;
  }>;
}

export interface Activity {
  id: string;
  type: 'comment' | 'edit' | 'approval' | 'share' | 'mention' | 'status_change';
  user: User;
  target: {
    type: 'document' | 'proposal' | 'meeting' | 'workflow';
    id: string;
    title: string;
  };
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: User[];
  createdAt: Date;
  updatedAt: Date;
  settings: {
    isPublic: boolean;
    allowGuestAccess: boolean;
    defaultRole: User['role'];
  };
}

export interface CollaborationSession {
  id: string;
  itemId: string;
  itemType: 'document' | 'proposal' | 'meeting';
  participants: Array<{
    user: User;
    cursor?: { x: number; y: number };
    selection?: { start: number; end: number };
    lastActivity: Date;
  }>;
  isActive: boolean;
  startedAt: Date;
}

const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Dr. Rodriguez',
    email: 'rodriguez@hospital.com',
    avatar: '/avatars/rodriguez.jpg',
    role: 'admin',
    status: 'online',
    lastSeen: new Date(),
    department: 'Cardiology',
  },
  {
    id: 'user-2',
    name: 'Dr. Johnson',
    email: 'johnson@hospital.com',
    avatar: '/avatars/johnson.jpg',
    role: 'reviewer',
    status: 'online',
    lastSeen: new Date(Date.now() - 300000), // 5 minutes ago
    department: 'Emergency Medicine',
  },
  {
    id: 'user-3',
    name: 'Dr. Smith',
    email: 'smith@hospital.com',
    avatar: '/avatars/smith.jpg',
    role: 'contributor',
    status: 'away',
    lastSeen: new Date(Date.now() - 1800000), // 30 minutes ago
    department: 'Pediatrics',
  },
  {
    id: 'user-4',
    name: 'Dr. Wilson',
    email: 'wilson@hospital.com',
    role: 'viewer',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
    department: 'Radiology',
  },
];

export function useCollaboration() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [teams, setTeams] = useState<Team[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [collaborationSessions, setCollaborationSessions] = useState<CollaborationSession[]>([]);
  const [currentUser] = useState<User>(mockUsers[0]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Simulated WebSocket connection
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize mock activities
    const mockActivities: Activity[] = [
      {
        id: 'act-1',
        type: 'comment',
        user: mockUsers[1],
        target: { type: 'document', id: 'doc-1', title: 'Clinical Protocol v2.1' },
        description: 'Added a comment on section 3.2',
        timestamp: new Date(Date.now() - 300000),
      },
      {
        id: 'act-2',
        type: 'approval',
        user: mockUsers[0],
        target: { type: 'proposal', id: 'prop-1', title: 'Emergency Response Update' },
        description: 'Approved the proposal',
        timestamp: new Date(Date.now() - 600000),
      },
      {
        id: 'act-3',
        type: 'edit',
        user: mockUsers[2],
        target: { type: 'document', id: 'doc-2', title: 'Patient Safety Guidelines' },
        description: 'Updated safety protocols',
        timestamp: new Date(Date.now() - 900000),
      },
    ];
    setActivities(mockActivities);

    // Simulate periodic status updates
    const interval = setInterval(() => {
      setUsers(prev => prev.map(user => ({
        ...user,
        lastSeen: user.status === 'online' ? new Date() : user.lastSeen,
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const addComment = useCallback(async (
    itemId: string,
    content: string,
    parentId?: string,
    mentions?: string[]
  ) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newComment: Comment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content,
        author: currentUser,
        createdAt: new Date(),
        mentions,
        reactions: [],
      };

      setComments(prev => {
        const itemComments = prev[itemId] || [];
        if (parentId) {
          // Add as reply
          const updatedComments = itemComments.map(comment => 
            comment.id === parentId 
              ? { ...comment, replies: [...(comment.replies || []), newComment] }
              : comment
          );
          return { ...prev, [itemId]: updatedComments };
        } else {
          // Add as new comment
          return { ...prev, [itemId]: [...itemComments, newComment] };
        }
      });

      // Add activity
      const activity: Activity = {
        id: `act-${Date.now()}`,
        type: 'comment',
        user: currentUser,
        target: { type: 'document', id: itemId, title: 'Document' },
        description: `Added a ${parentId ? 'reply' : 'comment'}`,
        timestamp: new Date(),
      };
      setActivities(prev => [activity, ...prev]);

      toast({
        title: 'Comment Added',
        description: 'Your comment has been posted successfully.',
      });

      return newComment;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add comment. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  const updateComment = useCallback(async (itemId: string, commentId: string, content: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      setComments(prev => {
        const itemComments = prev[itemId] || [];
        const updatedComments = itemComments.map(comment => 
          comment.id === commentId 
            ? { ...comment, content, updatedAt: new Date() }
            : comment
        );
        return { ...prev, [itemId]: updatedComments };
      });

      toast({
        title: 'Comment Updated',
        description: 'Your comment has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update comment. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteComment = useCallback(async (itemId: string, commentId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      setComments(prev => {
        const itemComments = prev[itemId] || [];
        const updatedComments = itemComments.filter(comment => comment.id !== commentId);
        return { ...prev, [itemId]: updatedComments };
      });

      toast({
        title: 'Comment Deleted',
        description: 'Comment has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete comment. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addReaction = useCallback(async (itemId: string, commentId: string, emoji: string) => {
    setComments(prev => {
      const itemComments = prev[itemId] || [];
      const updatedComments = itemComments.map(comment => {
        if (comment.id !== commentId) return comment;

        const reactions = comment.reactions || [];
        const existingReaction = reactions.find(r => r.emoji === emoji);
        const userAlreadyReacted = existingReaction?.users.some(u => u.id === currentUser.id);

        if (userAlreadyReacted) {
          // Remove user's reaction
          return {
            ...comment,
            reactions: reactions.map(r => 
              r.emoji === emoji 
                ? { 
                    ...r, 
                    users: r.users.filter(u => u.id !== currentUser.id),
                    count: r.count - 1 
                  }
                : r
            ).filter(r => r.count > 0)
          };
        } else {
          // Add user's reaction
          if (existingReaction) {
            return {
              ...comment,
              reactions: reactions.map(r => 
                r.emoji === emoji 
                  ? { 
                      ...r, 
                      users: [...r.users, currentUser],
                      count: r.count + 1 
                    }
                  : r
              )
            };
          } else {
            return {
              ...comment,
              reactions: [...reactions, {
                emoji,
                users: [currentUser],
                count: 1,
              }]
            };
          }
        }
      });
      return { ...prev, [itemId]: updatedComments };
    });
  }, [currentUser]);

  const createTeam = useCallback(async (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newTeam: Team = {
        ...teamData,
        id: `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setTeams(prev => [...prev, newTeam]);

      toast({
        title: 'Team Created',
        description: `${newTeam.name} has been created successfully.`,
      });

      return newTeam;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create team. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const inviteToTeam = useCallback(async (teamId: string, userEmail: string, role: User['role']) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      // Simulate user invitation
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userEmail.split('@')[0],
        email: userEmail,
        role,
        status: 'offline',
        lastSeen: new Date(),
      };

      setUsers(prev => [...prev, newUser]);
      setTeams(prev => prev.map(team => 
        team.id === teamId 
          ? { ...team, members: [...team.members, newUser], updatedAt: new Date() }
          : team
      ));

      toast({
        title: 'Invitation Sent',
        description: `Invitation has been sent to ${userEmail}.`,
      });

      return newUser;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send invitation. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startCollaboration = useCallback(async (itemId: string, itemType: CollaborationSession['itemType']) => {
    const session: CollaborationSession = {
      id: `session-${Date.now()}`,
      itemId,
      itemType,
      participants: [{ user: currentUser, lastActivity: new Date() }],
      isActive: true,
      startedAt: new Date(),
    };

    setCollaborationSessions(prev => [...prev, session]);
    return session;
  }, [currentUser]);

  const joinCollaboration = useCallback(async (sessionId: string) => {
    setCollaborationSessions(prev => prev.map(session => 
      session.id === sessionId
        ? {
            ...session,
            participants: [
              ...session.participants.filter(p => p.user.id !== currentUser.id),
              { user: currentUser, lastActivity: new Date() }
            ]
          }
        : session
    ));
  }, [currentUser]);

  const getItemComments = useCallback((itemId: string) => {
    return comments[itemId] || [];
  }, [comments]);

  const getTeamMembers = useCallback((teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.members || [];
  }, [teams]);

  const getOnlineUsers = useCallback(() => {
    return users.filter(user => user.status === 'online');
  }, [users]);

  const getRecentActivities = useCallback((limit: number = 10) => {
    return activities.slice(0, limit);
  }, [activities]);

  return {
    users,
    teams,
    activities,
    comments,
    collaborationSessions,
    currentUser,
    isLoading,
    addComment,
    updateComment,
    deleteComment,
    addReaction,
    createTeam,
    inviteToTeam,
    startCollaboration,
    joinCollaboration,
    getItemComments,
    getTeamMembers,
    getOnlineUsers,
    getRecentActivities,
  };
}