
import React, { ReactNode } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: string; // e.g., 'delay-300'
}

const RevealOnScroll: React.FC<RevealOnScrollProps> = ({ children, className = '', delay = 'delay-0' }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2, triggerOnce: true });

  const classes = `transition-all duration-700 ${delay} ${
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
  } ${className}`;

  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  );
};

export default RevealOnScroll;
