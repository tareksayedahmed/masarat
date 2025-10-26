
import React, { createContext, useState, useContext, PropsWithChildren } from 'react';
import axios from 'axios';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
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

const API_URL = 'http://localhost:5000/api/auth';

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        if (response.data.user) {
            setUser(response.data.user);
            // You might want to store the token for authenticated requests
            // localStorage.setItem('token', response.data.token);
            // axios.defaults.headers.common['x-auth-token'] = response.data.token;
            closeLoginModal();
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
        const response = await axios.post(`${API_URL}/register`, { name, email, password });
        if (response.data.user) {
            setUser(response.data.user);
            // localStorage.setItem('token', response.data.token);
            // axios.defaults.headers.common['x-auth-token'] = response.data.token;
            closeLoginModal();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Registration failed:', error);
        return false;
    }
  }

  const forgotPassword = async (email: string): Promise<boolean> => {
    // This is a mock implementation.
    console.log(`Password reset requested for: ${email}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Always return true in the demo to show the success message
    return true;
  };

  const loginWithProvider = async (provider: 'google' | 'facebook'): Promise<boolean> => {
    try {
        console.log(`Simulating login with ${provider}`);
        // This is a mock implementation as OAuth is not set up.
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        const mockUser: User = provider === 'google' 
            ? { id: 'user-google-mock', name: 'مستخدم جوجل', email: 'google.user@example.com', role: UserRole.Customer }
            : { id: 'user-facebook-mock', name: 'مستخدم فيسبوك', email: 'facebook.user@example.com', role: UserRole.Customer };
        
        setUser(mockUser);
        closeLoginModal();
        return true;

    } catch (error) {
        console.error(`Social login with ${provider} failed:`, error);
        return false;
    }
  };

  const logout = () => {
    setUser(null);
    // localStorage.removeItem('token');
    // delete axios.defaults.headers.common['x-auth-token'];
  };

  const openLoginModal = () => setLoginModalOpen(true);
  const closeLoginModal = () => setLoginModalOpen(false);


  return (
    <AuthContext.Provider value={{ user, login, register, forgotPassword, loginWithProvider, logout, isLoginModalOpen, openLoginModal, closeLoginModal }}>
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
