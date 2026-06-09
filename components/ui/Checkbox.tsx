import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, description, id, ...props }) => {
  return (
    <div className="relative flex items-start">
      <div className="flex h-6 items-center">
        <input
          id={id}
          aria-describedby={description ? `${id}-description` : undefined}
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-600 dark:bg-gray-700 dark:border-gray-600"
          {...props}
        />
      </div>
      <div className="ms-3 text-sm leading-6">
        <label htmlFor={id} className="font-medium text-gray-900 dark:text-gray-100">
          {label}
        </label>
        {description && (
          <p id={`${id}-description`} className="text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default Checkbox;
