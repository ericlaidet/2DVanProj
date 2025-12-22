// apps/web/src/components/buttons/Button.tsx
import React from 'react';
import clsx from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'blue' | 'green' | 'red' | 'gray' | 'yellow';
  size?: 'small' | 'normal';
};

const Button: React.FC<ButtonProps> = ({
  variant = 'blue',
  size = 'normal',
  children,
  className,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={clsx(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
