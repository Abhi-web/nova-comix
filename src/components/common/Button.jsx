import React from "react";

/**
 * Reusable Design System Button for NOVA PANEL
 * Variants: primary | secondary | outline | ghost | danger
 * Sizes: sm | md | lg
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  icon = null,
  iconPosition = "left",
  fullWidth = false,
  onClick,
  type = "button",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5 h-8 font-medium",
    md: "text-xs sm:text-sm px-4 py-2 gap-2 h-9 sm:h-10 font-semibold tracking-wide",
    lg: "text-sm sm:text-base px-6 py-2.5 gap-2.5 h-11 sm:h-12 font-semibold tracking-wide",
  };

  const variantStyles = {
    primary:
      "bg-accent hover:bg-accent-hover text-background-primary font-bold shadow-sm hover:shadow-glow-accent border border-accent/40 active:shadow-none transition-all",
    secondary:
      "bg-background-card hover:bg-background-cardHover text-content-primary border border-border-subtle hover:border-border-strong active:bg-background-card transition-all",
    outline:
      "bg-transparent text-content-primary border border-border-subtle hover:border-accent hover:text-accent active:bg-accent/5 transition-all",
    ghost:
      "bg-transparent text-content-secondary hover:text-content-primary hover:bg-white/[0.04] active:bg-white/[0.08] transition-all",
    danger:
      "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/30 transition-all",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.primary}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <span className="shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5">{icon}</span>
      )}
    </button>
  );
}
