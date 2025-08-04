import React from 'react';

interface ChipProps {
  label: string;
  index?: number;
  icon?: React.ReactNode;
  variant?: 'filled' | 'outlined';
  onClick?: () => void;
  className?: string;
}

const Chip: React.FC<ChipProps> = ({
  label,
  index,
  icon,
  variant = 'filled',
  onClick,
  className = '',
}) => {
  const baseClasses = `
    inline-flex items-center gap-2 px-4 py-2 
    font-bold text-sm cursor-pointer whitespace-nowrap 
    rounded-full transition-all duration-200 hover:shadow-md
  `;

  const variantClasses =
    variant === 'filled'
      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'
      : 'border border-theme bg-theme-secondary text-theme-primary hover:bg-gray-100 dark:hover:bg-gray-700';

  return (
    <div
      key={index}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
    >
      {icon && (
        <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
      )}
      <span>{label}</span>
    </div>
  );
};

export default Chip;
