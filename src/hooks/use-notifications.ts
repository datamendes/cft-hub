import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high';
  category: 'document' | 'proposal' | 'meeting' | 'workflow' | 'system';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  categories: {
    document: boolean;
    proposal: boolean;
    meeting: boolean;
    workflow: boolean;
    system: boolean;
  };
  priority: {
    low: boolean;
    medium: boolean;
    high: boolean;
  };
}

const defaultPreferences: NotificationPreferences = {
  email: true,
  inApp: true,
  categories: {
    document: true,
    proposal: true,
    meeting: true,
    workflow: true,
    system: true,
  },
  priority: {
    low: false,
    medium: true,
    high: true,
  },
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random notifications for demo
      if (Math.random() > 0.95) {
        const mockNotifications: Partial<Notification>[] = [
          {
            title: 'Document Approved',
            message: 'Clinical Protocol v2.1 has been approved',
            type: 'success',
            priority: 'medium',
            category: 'document',
          },
          {
            title: 'New Proposal Submitted',
            message: 'Emergency Protocol Update requires review',
            type: 'info',
            priority: 'high',
            category: 'proposal',
          },
          {
            title: 'Meeting Reminder',
            message: 'CFT Review Meeting starts in 15 minutes',
            type: 'warning',
            priority: 'high',
            category: 'meeting',
          },
          {
            title: 'Workflow Completed',
            message: 'Document approval workflow completed',
            type: 'success',
            priority: 'low',
            category: 'workflow',
          },
        ];

        const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        addNotification(randomNotification);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addNotification = useCallback((notification: Partial<Notification>) => {
    const newNotification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: notification.title || 'Notification',
      message: notification.message || '',
      type: notification.type || 'info',
      priority: notification.priority || 'medium',
      category: notification.category || 'system',
      timestamp: new Date(),
      read: false,
      actionUrl: notification.actionUrl,
      actionLabel: notification.actionLabel,
      userId: notification.userId,
      metadata: notification.metadata,
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 100)); // Keep max 100 notifications

    // Show toast for high priority notifications
    if (newNotification.priority === 'high' && preferences.inApp) {
      toast({
        title: newNotification.title,
        description: newNotification.message,
        variant: newNotification.type === 'error' ? 'destructive' : 'default',
      });
    }

    return newNotification;
  }, [preferences.inApp]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const updatePreferences = useCallback((newPreferences: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  }, []);

  const getUnreadCount = useCallback(() => {
    return notifications.filter(notif => !notif.read).length;
  }, [notifications]);

  const getFilteredNotifications = useCallback((filters?: {
    category?: string;
    priority?: string;
    read?: boolean;
  }) => {
    let filtered = notifications;

    if (filters?.category) {
      filtered = filtered.filter(notif => notif.category === filters.category);
    }

    if (filters?.priority) {
      filtered = filtered.filter(notif => notif.priority === filters.priority);
    }

    if (filters?.read !== undefined) {
      filtered = filtered.filter(notif => notif.read === filters.read);
    }

    return filtered;
  }, [notifications]);

  // Initial mock notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: 'notif-1',
        title: 'Document Pending Review',
        message: 'Clinical Protocol v2.0 requires your review',
        type: 'warning',
        priority: 'high',
        category: 'document',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        read: false,
        actionUrl: '/documents',
        actionLabel: 'Review Document',
      },
      {
        id: 'notif-2',
        title: 'Meeting Scheduled',
        message: 'CFT Review Meeting scheduled for tomorrow',
        type: 'info',
        priority: 'medium',
        category: 'meeting',
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
        read: false,
        actionUrl: '/meetings',
        actionLabel: 'View Meeting',
      },
      {
        id: 'notif-3',
        title: 'Proposal Approved',
        message: 'Emergency Response Protocol has been approved',
        type: 'success',
        priority: 'medium',
        category: 'proposal',
        timestamp: new Date(Date.now() - 10800000), // 3 hours ago
        read: true,
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  return {
    notifications,
    preferences,
    isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updatePreferences,
    getUnreadCount,
    getFilteredNotifications,
  };
}