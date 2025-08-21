import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

export type Role = 'admin' | 'reviewer' | 'contributor' | 'viewer';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  mfaEnabled?: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loginAs: (role: Role) => void;
  logout: () => void;
  setRoles: (roles: Role[]) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const defaultUser: AuthUser = {
  id: 'mock-user-1',
  name: 'Dr. Rodriguez',
  email: 'rodriguez@hospital.com',
  roles: ['admin'],
  mfaEnabled: false,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(defaultUser);

  const loginAs = (role: Role) => {
    setUser({ ...defaultUser, roles: [role] });
  };

  const logout = () => setUser(null);

  const setRoles = (roles: Role[]) => setUser((u) => (u ? { ...u, roles } : u));

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    loginAs,
    logout,
    setRoles,
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
