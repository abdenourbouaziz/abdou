import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-poppins font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles = {
    primary:
      "bg-dz-green text-white hover:bg-dz-green-dark focus:ring-dz-green dark:bg-dz-green dark:hover:bg-dz-green-dark",
    secondary:
      "bg-dz-red text-white hover:bg-dz-red-dark focus:ring-dz-red dark:bg-dz-red dark:hover:bg-dz-red-dark",
    outline:
      "border-2 border-dz-green text-dz-green hover:bg-dz-green hover:text-white focus:ring-dz-green dark:border-dz-green dark:text-dz-green dark:hover:bg-dz-green dark:hover:text-white",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    />
  );
}
