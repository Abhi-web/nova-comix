import React from "react";
import { Link } from "react-router-dom";

/**
 * GenreBadge Component for NOVA PANEL
 * Can be rendered as an interactive filter pill or a link to the genre page.
 */
export default function GenreBadge({
  genre,
  count = null,
  active = false,
  onClick = null,
  asLink = true,
  size = "md",
  className = "",
}) {
  const name = typeof genre === "string" ? genre : genre.name;
  const countValue = count !== null ? count : (typeof genre === "object" ? genre.count : null);

  const baseStyles =
    "inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-200 select-none border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

  const sizeStyles = {
    sm: "text-xs px-2.5 py-1",
    md: "text-sm px-3.5 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const stateStyles = active
    ? "bg-accent text-background-primary border-accent font-semibold shadow-sm"
    : "bg-background-card hover:bg-background-cardHover text-content-secondary hover:text-content-primary border-border-subtle hover:border-border-strong";

  const content = (
    <>
      <span>{name}</span>
      {countValue !== null && countValue !== undefined && (
        <span
          className={`text-[11px] px-1.5 py-0.2 rounded font-mono ${
            active
              ? "bg-black/20 text-background-primary"
              : "bg-background-secondary text-content-muted"
          }`}
        >
          {countValue}
        </span>
      )}
    </>
  );

  if (asLink) {
    return (
      <Link
        to={`/genres?genre=${encodeURIComponent(name.toLowerCase())}`}
        className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${stateStyles} ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${stateStyles} ${className}`}
    >
      {content}
    </button>
  );
}
