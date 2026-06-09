import React from 'react';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface RadioGroupProps {
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  name: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, selectedValue, onChange, name }) => {
  return (
    <div className="space-y-4">
      {options.map((option) => (
        <label
          key={option.value}
          className={`relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none transition-all dark:bg-gray-800 ${
            selectedValue === option.value
              ? 'border-orange-600 ring-2 ring-orange-600 dark:border-orange-500'
              : 'border-gray-300 dark:border-gray-700'
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
            aria-labelledby={`${name}-${option.value}-label`}
            aria-describedby={option.description ? `${name}-${option.value}-description` : undefined}
          />
          <span className="flex flex-1">
            <span className="flex flex-col">
              <span id={`${name}-${option.value}-label`} className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                {option.label}
              </span>
              {option.description && (
                <span id={`${name}-${option.value}-description`} className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  {option.description}
                </span>
              )}
            </span>
            {option.icon && <span className="ms-auto">{option.icon}</span>}
          </span>
          <svg className={`h-5 w-5 ${selectedValue === option.value ? 'text-orange-600' : 'text-transparent'}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
