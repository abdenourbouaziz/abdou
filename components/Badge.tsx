import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

export function Badge({ variant = "default", className = "", children }: BadgeProps) {
  const variantStyles = {
    default: "bg-dz-green text-white",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    error: "bg-red-500 text-white",
  };

  return (
    <span
      className={`font-poppins inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-bold ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
