import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export default function UnauthorizedPage() {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-background-card border border-rose-500/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-amber-500" />
        
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 text-rose-400" />
        </div>

        <h1 className="text-2xl font-bold text-content-primary mb-2">
          Restricted Access Area
        </h1>
        
        <p className="text-sm text-content-secondary mb-6 leading-relaxed">
          You are currently signed in as <span className="font-semibold text-content-primary">{user?.email || 'User'}</span> ({user?.role || 'user'}), but administrator permissions are required to access the NOVA PANEL management console.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full sm:w-auto flex items-center justify-center gap-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
          >
            <LogOut className="w-4 h-4" />
            Switch Account
          </Button>
        </div>
      </div>
    </div>
  );
}
