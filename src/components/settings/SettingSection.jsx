import React from "react";

/**
 * SettingSection Component for NOVA PANEL
 * Structured section wrapper with category icon, title, description, and card shell.
 */
export default function SettingSection({
  title,
  description = null,
  icon = null,
  children,
  className = "",
}) {
  return (
    <section className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        {icon && (
          <span className="w-5 h-5 rounded-md bg-accent/15 flex items-center justify-center text-accent text-xs">
            {icon}
          </span>
        )}
        <h3 className="text-xs font-black tracking-wider uppercase text-accent font-mono">
          {title}
        </h3>
      </div>
      {description && (
        <p className="text-xs text-content-secondary max-w-xl -mt-1">
          {description}
        </p>
      )}
      <div className="rounded-2xl bg-[#171A22] border border-[#262A35] p-3.5 sm:p-4 space-y-4">
        {children}
      </div>
    </section>
  );
}
