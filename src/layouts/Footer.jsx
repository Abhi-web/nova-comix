import React from "react";
import { Link } from "react-router-dom";
import { BRAND_CONFIG } from "../utils/brand";
import Logo from "../components/navigation/Logo";

/**
 * Editorial Footer Component for NOVA PANEL
 */
export default function Footer() {
  return (
    <footer className="w-full bg-background-secondary border-t border-border-subtle mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Logo />
            <p className="text-sm text-content-secondary max-w-sm leading-relaxed">
              {BRAND_CONFIG.description}
            </p>
            <div className="pt-2 flex items-center gap-3">
              {BRAND_CONFIG.socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-md bg-background-card hover:bg-background-cardHover text-content-secondary hover:text-accent border border-border-subtle hover:border-accent/40 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-content-primary mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-content-secondary">
              {BRAND_CONFIG.navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/manga" className="hover:text-accent transition-colors">
                  Recently Updated
                </Link>
              </li>
            </ul>
          </div>

          {/* Editorial & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-content-primary mb-4">
              Platform & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-content-secondary">
              <li>
                <span className="cursor-pointer hover:text-accent transition-colors">
                  Content Guidelines
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-accent transition-colors">
                  DMCA & Copyright Policy
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-accent transition-colors">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-accent transition-colors">
                  Privacy Policy
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="mt-12 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-content-muted">
          <p>
            © {new Date().getFullYear()} {BRAND_CONFIG.name}. All mock content used for architectural & design prototype purposes.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Operational v{BRAND_CONFIG.version}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
