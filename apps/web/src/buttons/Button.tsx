// components/buttons/Button.tsx
import React, { ReactNode } from "react";
import clsx from "clsx";

type ButtonProps = {
  children: ReactNode;
  variant?: "blue" | "green" | "red" | "gray" | "yellow";
  size?: "small" | "normal";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "blue",
  size = "normal",
  onClick,
  disabled = false,
  className,
}) => {
  const base = "rounded font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1";

  const sizes = {
    small: "px-2 py-1 text-sm",
    normal: "px-3 py-2 text-base",
  };

  const variants = {
    blue: "bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700",
    green: "bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700",
    red: "bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700",
    gray: "bg-gray-500 hover:bg-gray-600 text-white dark:bg-gray-600 dark:hover:bg-gray-700",
    yellow: "bg-yellow-400 hover:bg-yellow-500 text-black dark:bg-yellow-500 dark:hover:bg-yellow-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(base, sizes[size], variants[variant], disabled && "opacity-50 cursor-not-allowed", className)}
    >
      {children}
    </button>
  );
};

export default Button;

