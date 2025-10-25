import React, { createContext, useState, useContext, PropsWithChildren } from 'react';
import axios from 'axios';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api/auth';

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      if (res.data.token) {
        // In a real app, you would store the token in localStorage
        setUser(res.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password?: string): Promise<boolean> => {
     try {
      const res = await axios.post(`${API_URL}/register`, { name, email, password });
      if (res.data.token) {
        // In a real app, you would store the token in localStorage
        setUser(res.data.user);
        return true;
      }
      return false;
    } catch (error) {
        console.error('Registration failed:', error);
        return false;
    }
  }

  const logout = () => {
    setUser(null);
  };

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);


  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoginModalOpen, openLoginModal, closeLoginModal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};