import React from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  size?: "sm" | "md" | "lg";
  badge?: React.ReactNode;
}

export function IconButton({
  icon,
  label,
  size = "md",
  badge,
  className = "",
  ...props
}: IconButtonProps) {
  const sizeStyles = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  };

  return (
    <button
      className={`relative inline-flex items-center justify-center rounded-lg text-gray-700 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 ${sizeStyles[size]} ${className}`}
      title={label}
      {...props}
    >
      {icon}
      {badge && (
        <span className="absolute right-0 top-0 flex items-center justify-center rounded-full bg-dz-red px-1.5 py-0.5 text-xs font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}
