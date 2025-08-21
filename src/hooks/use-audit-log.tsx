import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Severity = 'info' | 'warning' | 'error' | 'security';

export interface AuditEvent {
  id: string;
  actor?: {
    id: string;
    name: string;
    email?: string;
  };
  action: string;
  target?: { type: string; id?: string; name?: string };
  timestamp: string; // ISO
  severity: Severity;
  metadata?: Record<string, any>;
}

interface AuditLogContextValue {
  events: AuditEvent[];
  addEvent: (evt: Omit<AuditEvent, 'id' | 'timestamp'>) => void;
  clear: () => void;
  exportJSON: () => void;
}

const STORAGE_KEY = 'audit_log_events_v1';

const AuditLogContext = createContext<AuditLogContextValue | undefined>(undefined);

export function AuditLogProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<AuditEvent[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuditEvent[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {}
  }, [events]);

  const addEvent = useCallback((evt: Omit<AuditEvent, 'id' | 'timestamp'>) => {
    setEvents((prev) => [
      { id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, timestamp: new Date().toISOString(), ...evt },
      ...prev,
    ]);
  }, []);

  const clear = useCallback(() => setEvents([]), []);

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [events]);

  const value = useMemo(() => ({ events, addEvent, clear, exportJSON }), [events, addEvent, clear, exportJSON]);

  return <AuditLogContext.Provider value={value}>{children}</AuditLogContext.Provider>;
}

export function useAuditLog() {
  const ctx = useContext(AuditLogContext);
  if (!ctx) throw new Error('useAuditLog must be used within AuditLogProvider');
  return ctx;
}
