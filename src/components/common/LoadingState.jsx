import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Reusable LoadingState component for async operations.
 */
export default function LoadingState({
  message = "Loading archive...",
  className = "",
  inline = false,
}) {
  if (inline) {
    return (
      <div className={`inline-flex items-center gap-2 text-sm text-content-secondary ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin text-accent" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-12 text-center min-h-[220px] ${className}`}
    >
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-border-subtle border-t-accent animate-spin" />
        <div className="absolute w-3 h-3 rounded-full bg-accent animate-pulseSubtle" />
      </div>
      <p className="text-sm font-medium text-content-secondary tracking-wide">
        {message}
      </p>
    </div>
  );
}
