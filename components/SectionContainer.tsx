import React from "react";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

export function SectionContainer({
  children,
  className = "",
  maxWidth = "lg",
}: SectionContainerProps) {
  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full",
  };

  return (
    <section
      className={`mx-auto w-full ${maxWidthStyles[maxWidth]} px-4 py-8 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </section>
  );
}
