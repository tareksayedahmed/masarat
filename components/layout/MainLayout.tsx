
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AiAssistant from '../common/AiAssistant';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const MainLayout: React.FC = () => {
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen text-gray-800 dark:text-gray-200">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
      
      {/* AI Assistant FAB */}
      <button 
        onClick={() => setIsAiAssistantOpen(true)}
        className="fixed bottom-6 end-6 bg-orange-600 hover:bg-orange-700 text-white rounded-full p-4 shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 z-40"
        aria-label="Open AI Assistant"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      <Modal isOpen={isAiAssistantOpen} onClose={() => setIsAiAssistantOpen(false)} title="مساعد مسارات الذكي">
        <AiAssistant />
      </Modal>
    </div>
  );
};

export default MainLayout;