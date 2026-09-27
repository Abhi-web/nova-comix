import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  PlusCircle,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('Signed out of Admin Console');
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/stories', label: 'Stories', icon: BookOpen, end: false },
    { to: '/admin/stories/new', label: 'Add Story', icon: PlusCircle, end: true },
  ];

  return (
    <div className="min-h-screen bg-background-primary text-content-primary flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-background-secondary/95 backdrop-blur-xl border-r border-border-subtle flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-screen shadow-2xl`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-border-subtle flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold shadow-glow-accent/20">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider text-content-primary">
                NOVA<span className="text-accent">ADMIN</span>
              </span>
              <span className="block text-[10px] text-content-tertiary tracking-widest uppercase font-semibold">
                Console
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg text-content-tertiary hover:text-content-primary hover:bg-white/5 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6 px-3.5 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-content-tertiary">
            Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to) &&
                (item.to !== '/admin' || location.pathname === '/admin');

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-accent/15 text-accent border border-accent/35 shadow-glow-accent/10 font-bold'
                    : 'text-content-secondary hover:text-content-primary hover:bg-background-card/80 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-content-tertiary'}`} />
                {item.label}
              </NavLink>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-content-tertiary">
            System
          </div>
          <NavLink
            to="/admin/users"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-accent/15 text-accent border border-accent/35 shadow-glow-accent/10 font-bold'
                  : 'text-content-secondary hover:text-content-primary hover:bg-background-card/80 border border-transparent'
              }`
            }
          >
            <Users className="w-4 h-4 text-content-tertiary" />
            Users
          </NavLink>
          <NavLink
            to="/admin/settings"
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-accent/15 text-accent border border-accent/35 shadow-glow-accent/10 font-bold'
                  : 'text-content-secondary hover:text-content-primary hover:bg-background-card/80 border border-transparent'
              }`
            }
          >
            <Settings className="w-4 h-4 text-content-tertiary" />
            Settings
          </NavLink>
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-border-subtle bg-background-primary/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center font-bold text-accent text-sm shrink-0 shadow-glow-accent/10">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-content-primary truncate">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[11px] text-content-tertiary truncate">
                {user?.email || 'admin@novapanel.local'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border-subtle/50">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-content-secondary hover:text-content-primary rounded-xl bg-background-card hover:bg-background-cardHover border border-border-subtle transition-colors font-medium"
              title="Open public website in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-accent" />
              <span>Public Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors border border-transparent hover:border-rose-500/20"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 px-4 sm:px-6 lg:px-8 border-b border-border-subtle bg-background-primary/90 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between shadow-card">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl text-content-secondary hover:text-content-primary hover:bg-background-card lg:hidden border border-border-subtle"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-content-tertiary font-medium">
              <Link to="/admin" className="hover:text-accent transition-colors">
                Admin
              </Link>
              <span>/</span>
              <span className="text-content-primary font-bold capitalize">
                {location.pathname.split('/')[2] || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/stories/new"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-background-primary bg-accent hover:bg-accent/90 rounded-xl shadow-glow-accent/20 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Story</span>
            </Link>
          </div>
        </header>

        {/* Routed Admin Page */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
