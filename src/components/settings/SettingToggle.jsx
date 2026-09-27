import React from "react";

/**
 * SettingToggle Component for NOVA PANEL
 * Accessible switch toggle with keyboard navigation and smooth transition.
 */
export default function SettingToggle({
  checked,
  onChange,
  label = "",
  disabled = false,
  className = "",
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        checked ? "bg-accent" : "bg-[#262A35]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5 bg-background-primary" : "translate-x-0 bg-content-secondary"
        }`}
      />
    </button>
  );
}
