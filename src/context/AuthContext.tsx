import React, { createContext, useContext, useState } from 'react';

interface AuthUser {
  name: string;
  phone: string;
  email: string;
  photoUrl: string;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser;
  login: () => void;
  logout: () => void;
}

const defaultUser: AuthUser = {
  name: 'Aditi Sharma',
  phone: '+91 98765 43210',
  email: 'aditi.sharma@example.com',
  photoUrl: 'https://i.pravatar.cc/150?img=47',
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const value: AuthContextValue = {
    isAuthenticated,
    user: defaultUser,
    login: () => setIsAuthenticated(true),
    logout: () => setIsAuthenticated(false),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
