import React from "react";

/**
 * SettingRow Component for NOVA PANEL
 * Clean flexible row layout with setting label, explanation, and control widget.
 */
export default function SettingRow({
  label,
  description = null,
  children,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}
    >
      <div className="space-y-0.5">
        <label className="text-xs sm:text-sm font-bold text-content-primary tracking-tight block">
          {label}
        </label>
        {description && (
          <p className="text-[11px] sm:text-xs text-content-muted leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="shrink-0 sm:self-center">{children}</div>
    </div>
  );
}
