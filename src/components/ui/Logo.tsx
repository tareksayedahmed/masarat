import React from 'react';
import { Route, Car } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', iconOnly = false }) => {
  const { isRtl } = useLanguage();

  return (
    <div className={`flex items-center gap-2 font-bold cursor-pointer ${className}`}>
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/20">
        <Route className="w-6 h-6 animate-pulse-subtle" />
        <Car className="absolute w-3.5 h-3.5 bottom-1 right-1 text-white bg-orange-600 rounded-full p-0.5 border border-white" />
      </div>
      {!iconOnly && (
        <div className="flex flex-col select-none">
          <span className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white leading-none">
            مسارات
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono tracking-wider">
            MASARAT CARS
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
