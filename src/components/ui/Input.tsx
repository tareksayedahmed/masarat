import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label ? (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        ) : null}
        <div className="relative flex items-center">
          {icon ? (
            <div className="absolute right-4 text-gray-400 dark:text-gray-500 pointer-events-none">
              {icon}
            </div>
          ) : null}
          <input
            ref={ref}
            className={`w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 placeholder:text-gray-400 text-sm sm:text-base ${
              icon ? 'pr-11' : ''
            } ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
            {...props}
          />
        </div>
        {error ? (
          <span className="text-xs text-red-500 font-medium">{error}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
