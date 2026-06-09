import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AiAssistant from '../common/AiAssistant';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../ui/Modal';
import { AuthForm } from '../auth/AuthForm';

export const MainLayout: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      {/* Absolute overlay chatbot floating button */}
      <AiAssistant />

      {/* Global Auth Modal - safely rendered outside the sticky header container */}
      <Modal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} title="تسجيل الدخول إلى مسارات">
        <AuthForm onSuccess={() => setIsAuthOpen(false)} />
      </Modal>
    </div>
  );
};

export default MainLayout;
