import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from '@/types';
import { demoUsers } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('parkeat_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback(async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const demoUser = demoUsers.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (demoUser) {
      const userData: User = {
        id: demoUser.id,
        username: demoUser.username,
        email: demoUser.email,
        name: demoUser.name,
        avatar: demoUser.avatar,
        phone: demoUser.phone,
        createdAt: new Date(),
      };
      setUser(userData);
      localStorage.setItem('parkeat_user', JSON.stringify(userData));
      return { success: true };
    }

    // Check for registered users
    const registeredUsers = JSON.parse(localStorage.getItem('parkeat_registered_users') || '[]');
    const registeredUser = registeredUsers.find(
      (u: any) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (registeredUser) {
      const userData: User = {
        id: registeredUser.id,
        username: registeredUser.username,
        email: registeredUser.email,
        name: registeredUser.name,
        avatar: registeredUser.avatar,
        phone: registeredUser.phone,
        createdAt: new Date(registeredUser.createdAt),
      };
      setUser(userData);
      localStorage.setItem('parkeat_user', JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, error: 'Usuario o contraseña incorrectos' };
  }, []);

  const register = useCallback(async (
    username: string, 
    email: string, 
    password: string, 
    name: string
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if username exists
    const allUsers = [...demoUsers, ...JSON.parse(localStorage.getItem('parkeat_registered_users') || '[]')];
    if (allUsers.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { success: false, error: 'El nombre de usuario ya existe' };
    }
    if (allUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'El email ya está registrado' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      username,
      email,
      password,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      phone: '',
      createdAt: new Date().toISOString(),
    };

    const registeredUsers = JSON.parse(localStorage.getItem('parkeat_registered_users') || '[]');
    registeredUsers.push(newUser);
    localStorage.setItem('parkeat_registered_users', JSON.stringify(registeredUsers));

    const userData: User = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      name: newUser.name,
      avatar: newUser.avatar,
      phone: newUser.phone,
      createdAt: new Date(),
    };
    setUser(userData);
    localStorage.setItem('parkeat_user', JSON.stringify(userData));

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('parkeat_user');
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('parkeat_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
