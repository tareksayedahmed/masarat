import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, hoverable = false, className = '', ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-850 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm transition-all duration-300 ${
        hoverable ? 'hover:shadow-lg hover:-translate-y-1 hover:border-orange-500/15' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
