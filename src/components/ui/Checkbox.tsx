import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          ref={ref}
          className={`w-4 h-4 rounded border-gray-300 dark:border-gray-700 text-orange-600 focus:ring-orange-500/20 bg-white dark:bg-gray-800 ${className}`}
          {...props}
        />
        {label && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-350">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
