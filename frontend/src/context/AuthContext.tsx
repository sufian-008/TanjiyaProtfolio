'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '../services/api';

interface AdminUser {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAdmin: boolean;
  adminUser: AdminUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/profile');
        setAdminUser(response.data);
      } catch (err) {
        console.error('Session verification failed', err);
        localStorage.removeItem('adminToken');
        setAdminUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Route guarding for admin routes
  useEffect(() => {
    if (!loading) {
      if (pathname?.startsWith('/admin') && pathname !== '/admin/login' && !adminUser) {
        router.push('/admin/login');
      }
      if (pathname === '/admin/login' && adminUser) {
        router.push('/admin');
      }
    }
  }, [pathname, adminUser, loading, router]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('adminToken', token);
      setAdminUser(userData);
      setLoading(false);
      router.push('/admin');
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdminUser(null);
    router.push('/admin/login');
  };

  const isAdmin = !!adminUser;

  return (
    <AuthContext.Provider value={{ isAdmin, adminUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
