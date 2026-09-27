import React from "react";

/**
 * Reusable Skeleton placeholder component for loading states.
 * Variants: text | rect | card | circle
 */
export default function Skeleton({
  variant = "rect",
  width,
  height,
  className = "",
  count = 1,
}) {
  const baseClasses =
    "relative overflow-hidden bg-background-elevated/60 border border-border-subtle/30 before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/[0.05] before:to-transparent";

  const getVariantStyles = () => {
    switch (variant) {
      case "text":
        return "h-4 rounded-md w-full";
      case "circle":
        return "rounded-full aspect-square";
      case "card":
        return "aspect-cover w-full rounded-xl";
      case "rect":
      default:
        return "rounded-xl";
    }
  };

  const style = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} ${getVariantStyles()} ${className}`}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantStyles()} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}
