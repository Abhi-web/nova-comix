import React from "react";

/**
 * Reusable Design System Icon Button for NOVA PANEL
 * Variants: primary | secondary | outline | ghost
 * Sizes: sm | md | lg
 */
export default function IconButton({
  icon,
  label,
  variant = "ghost",
  size = "md",
  className = "",
  disabled = false,
  onClick,
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-95";

  const sizeStyles = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  const variantStyles = {
    primary:
      "bg-accent text-background-primary hover:bg-accent-hover shadow-sm hover:shadow-glow-accent",
    secondary:
      "bg-background-card hover:bg-background-cardHover text-content-primary border border-border-subtle hover:border-border-strong",
    outline:
      "bg-transparent text-content-primary border border-border-subtle hover:border-accent hover:text-accent",
    ghost:
      "bg-transparent text-content-secondary hover:text-content-primary hover:bg-white/5",
  };

  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.ghost}
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  );
}
