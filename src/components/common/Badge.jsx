import React from "react";

/**
 * Reusable Badge Component for NOVA PANEL
 * Variants: accent | neutral | success | info | warning | danger
 */
export default function Badge({
  children,
  variant = "neutral",
  size = "sm",
  className = "",
  icon = null,
}) {
  const baseStyles =
    "inline-flex items-center font-medium rounded-full uppercase tracking-wider select-none shrink-0 transition-colors";

  const sizeStyles = {
    xs: "text-[10px] px-2 py-0.5 gap-1 font-semibold leading-normal",
    sm: "text-[11px] px-2.5 py-0.5 gap-1.5 font-medium leading-normal",
    md: "text-xs px-3 py-1 gap-1.5 font-semibold leading-normal",
  };

  const variantStyles = {
    accent:
      "bg-accent text-background-primary font-bold shadow-sm",
    accentSubtle:
      "bg-accent-muted text-accent border border-accent-border font-semibold",
    neutral:
      "bg-background-elevated text-content-secondary border border-border-subtle hover:border-border-strong",
    success:
      "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30",
    info:
      "bg-sky-950/60 text-sky-400 border border-sky-500/30",
    warning:
      "bg-amber-950/60 text-amber-300 border border-amber-500/30",
    danger:
      "bg-rose-950/60 text-rose-400 border border-rose-500/30",
  };

  return (
    <span
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.sm}
        ${variantStyles[variant] || variantStyles.neutral}
        ${className}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
