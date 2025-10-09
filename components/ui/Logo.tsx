import React from 'react';

interface LogoProps {
  isDark?: boolean;
  compact?: boolean;
}

const Logo: React.FC<LogoProps> = ({ isDark = false, compact = false }) => {
  const primaryTextColor = isDark ? 'text-white' : 'text-gray-900';
  const taglineColor = isDark ? 'text-gray-300' : 'text-gray-500';

  return (
    <div className={`flex items-center ${compact ? 'justify-center w-full' : ''} gap-3`} aria-label="شعار مسارات لتأجير السيارات">
      {/* 3D Road-style SVG Icon */}
      <div className="w-11 h-11 flex-shrink-0">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Frame: Square with rounded corners, filled with dark yellow */}
            <rect x="2" y="2" width="60" height="60" rx="8" fill="#D97706"/>

            {/* Pavement (Sidewalk): Black, straight perspective */}
            <path d="M4 62 L26 2 L38 2 L60 62 Z" fill="black"/>

            {/* Road: White, on top of pavement */}
            <path d="M14 62 L30 2 L34 2 L50 62 Z" fill="white"/>

            {/* Road Lines: Dashed with perspective */}
            <path d="M 32 58 L 32 48" stroke="black" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M 32 42 L 32 34" stroke="black" strokeWidth="2.2" strokeLinecap="round"/>
            <path d="M 32 28 L 32 22" stroke="black" strokeWidth="2.0" strokeLinecap="round"/>
            <path d="M 32 17 L 32 13" stroke="black" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M 32 9 L 32 6" stroke="black" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </div>
      
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
