import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthState } from '@claro/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // TODO: Implement actual login logic
    console.log('Login:', email, password);
    setUser({
      id: '1',
      name: 'Test User',
      email: email,
      role: 'user',
      isEmailVerified: true,
      subscriptionTier: 'free',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const logout = async () => {
    // TODO: Implement actual logout logic
    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    // TODO: Implement actual register logic
    console.log('Register:', name, email, password);
    setUser({
      id: '1',
      name: name,
      email: email,
      role: 'user',
      isEmailVerified: false,
      subscriptionTier: 'free',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const updateProfile = async (updates: Partial<User>) => {
    // TODO: Implement actual profile update logic
    if (user) {
      setUser({ ...user, ...updates, updatedAt: new Date() });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}; 