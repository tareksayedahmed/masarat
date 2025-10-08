
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`bg-white/60 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:ring-2 hover:ring-orange-500/50 ${className}`} 
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;