import React, { createContext, useState, useContext, PropsWithChildren, useEffect } from 'react';
import { User } from '../types';
import api from '../api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  loginWithProvider: (provider: 'google' | 'facebook') => Promise<boolean>;
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (error) {
          console.error("Failed to load user", error);
          // Token is invalid, remove it
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const setAuthData = (data: { token: string; user: User }) => {
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    closeLoginModal();
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      setAuthData(res.data);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const register = async (name: string, email: string, password?: string): Promise<boolean> => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setAuthData(res.data);
      return true;
    } catch (error) {
      console.error("Registration failed", error);
      return false;
    }
  }

  const forgotPassword = async (email: string): Promise<boolean> => {
    console.log(`Password reset requested for: ${email}`);
    // This would be a backend call in a real app
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  };

  const loginWithProvider = async (provider: 'google' | 'facebook'): Promise<boolean> => {
    // This would involve a complex OAuth flow with the backend
    console.log(`Social login with ${provider} is not implemented in the backend yet.`);
    return false;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, forgotPassword, loginWithProvider, logout, isLoginModalOpen, openLoginModal, closeLoginModal }}>
      {!isLoading && children}
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
