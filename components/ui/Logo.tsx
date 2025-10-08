import React from 'react';

interface LogoProps {
  isDark?: boolean;
  compact?: boolean;
}

const Logo: React.FC<LogoProps> = ({ isDark = false, compact = false }) => {
  const primaryTextColor = isDark ? 'text-white' : 'text-black';
  const taglineColor = isDark ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`flex items-center ${compact ? 'justify-center w-full' : ''} gap-3`} aria-label="شعار مسارات لتأجير السيارات">
      {/* New Road-themed SVG Icon */}
      <div className="w-11 h-11 flex-shrink-0">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 40C12 40 12 8 24 8C36 8 36 40 40 40" stroke="#EA580C" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M24 18V26" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <path d="M24 34V40" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>
      
      {/* Updated Typography with Tagline for a complete brand identity */}
      {!compact && (
        <div className="flex flex-col">
          <span className={`text-2xl font-extrabold ${primaryTextColor} leading-tight`}>مسارات</span>
          <span className={`text-xs font-medium ${taglineColor} tracking-wider -mt-1`}>لتأجير السيارات</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
