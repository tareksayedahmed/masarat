import React, { createContext, useState, useContext, ReactNode, PropsWithChildren } from 'react';
import { User, UserRole } from '../types';
import { USERS } from '../constants';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => boolean;
  register: (name: string, email: string, password?: string) => boolean;
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// FIX: Updated component definition to use React.FC<PropsWithChildren> for better type inference.
export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [localUsers, setLocalUsers] = useState<User[]>(USERS);


  // Login checks against existing users. For demo, password is ignored.
  const login = (email: string, password?: string): boolean => {
    const foundUser = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  // Register creates a new customer if email doesn't exist
  const register = (name: string, email: string, password?: string): boolean => {
    const existingUser = localUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        return false; // User already exists
    }
    const newCustomer: User = { 
        id: `cust-${Date.now()}`, 
        name, 
        email, 
        role: UserRole.Customer 
    };
    // In a real app, this would be an API call. Here we add to local state.
    setLocalUsers([...localUsers, newCustomer]); 
    setUser(newCustomer);
    return true;
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