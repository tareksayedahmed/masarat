
import React from 'react';
import Logo from '../ui/Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6 text-center">
        <Logo isDark={true} />
        <p className="mt-4 text-sm text-gray-400">&copy; {new Date().getFullYear()} مسارات لتأجير السيارات. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
};

export default Footer;
