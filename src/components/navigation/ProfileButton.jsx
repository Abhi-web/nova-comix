import React from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

/**
 * ProfileButton Component for NOVA PANEL
 * Direct access to user profile or authentication screens.
 */
export default function ProfileButton({ className = "" }) {
  return (
    <Link
      to="/login"
      aria-label="User Account Login"
      className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-background-card/90 hover:bg-background-cardHover text-content-secondary hover:text-content-primary border border-border-subtle hover:border-accent/40 shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95 ${className}`}
    >
      <User className="w-4 h-4" />
    </Link>
  );
}
