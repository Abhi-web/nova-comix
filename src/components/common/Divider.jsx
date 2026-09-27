import React from "react";

/**
 * Reusable Divider Component for NOVA PANEL
 */
export default function Divider({
  orientation = "horizontal",
  className = "",
  label = null,
}) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`w-px self-stretch bg-border-subtle my-auto ${className}`}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        className={`flex items-center w-full my-4 text-xs font-medium text-content-muted uppercase tracking-wider ${className}`}
      >
        <div className="flex-1 border-t border-border-subtle"></div>
        <span className="px-3 text-content-muted">{label}</span>
        <div className="flex-1 border-t border-border-subtle"></div>
      </div>
    );
  }

  return (
    <hr
      role="separator"
      className={`border-0 border-t border-border-subtle w-full my-4 ${className}`}
    />
  );
}
