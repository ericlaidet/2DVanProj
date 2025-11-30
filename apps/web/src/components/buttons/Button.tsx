// apps/web/src/components/buttons/Button.tsx
import React from 'react';
import clsx from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'blue' | 'green' | 'red' | 'gray' | 'yellow';
  size?: 'small' | 'normal';
};

const Button: React.FC<ButtonProps> = ({ variant = 'blue', size = 'normal', children, className, ...rest }) => {
  const sizeCls = size === 'small' ? 'px-2 py-1 text-sm' : 'px-3 py-2 text-base';
  const variants: Record<string, string> = {
    blue: 'bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700',
    green: 'bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700',
    red: 'bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700',
    gray: 'bg-gray-500 hover:bg-gray-600 text-white dark:bg-gray-600 dark:hover:bg-gray-700',
    yellow: 'bg-yellow-400 hover:bg-yellow-500 text-black dark:bg-yellow-500 dark:hover:bg-yellow-600',
  };

  return (
    <button
      {...rest}
      className={clsx(
        'rounded font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
        sizeCls,
        variants[variant],
        rest.disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
