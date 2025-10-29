import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: React.ReactNode;
  className?: string;
}

const Select: React.FC<SelectProps> = ({ label, id, children, className = '', ...props }) => {
  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <select
        id={id}
        className={`w-full px-3 py-2 pr-8 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;