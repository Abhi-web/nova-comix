import React from "react";

/**
 * SettingDivider Component for NOVA PANEL
 */
export default function SettingDivider({ className = "" }) {
  return (
    <hr
      className={`border-0 border-t border-[#262A35]/80 my-3 sm:my-4 ${className}`}
    />
  );
}
