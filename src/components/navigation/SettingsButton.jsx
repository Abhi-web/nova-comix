import React from "react";
import { Sliders } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

/**
 * SettingsButton Component for NOVA PANEL Navbar
 * Quick trigger for the Settings modal.
 */
export default function SettingsButton({ className = "" }) {
  const { openSettings } = useSettings();

  return (
    <button
      type="button"
      onClick={openSettings}
      aria-label="Open Settings"
      title="Customize Settings"
      className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-background-card/90 hover:bg-background-cardHover text-content-secondary hover:text-content-primary border border-border-subtle hover:border-accent/40 shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95 ${className}`}
    >
      <Sliders className="w-4 h-4" />
    </button>
  );
}
