import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

/**
 * Breadcrumb Component for Story Details
 * Home / Explore / Story Title
 */
export default function Breadcrumb({ title, className = "" }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs sm:text-sm text-content-muted mb-6 ${className}`}
    >
      <ol className="flex items-center gap-2 flex-wrap">
        <li className="flex items-center">
          <Link
            to="/"
            className="hover:text-accent transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
          >
            <Home className="w-3.5 h-3.5 text-content-muted hover:text-accent" />
            <span>Home</span>
          </Link>
        </li>
        <li className="text-content-muted/60 select-none" aria-hidden="true">
          /
        </li>
        <li className="flex items-center">
          <Link
            to="/manga"
            className="hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
          >
            Explore
          </Link>
        </li>
        <li className="text-content-muted/60 select-none" aria-hidden="true">
          /
        </li>
        <li
          className="font-semibold text-content-primary truncate max-w-[200px] sm:max-w-md lg:max-w-lg"
          aria-current="page"
        >
          {title}
        </li>
      </ol>
    </nav>
  );
}
