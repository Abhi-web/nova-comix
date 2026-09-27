import React from 'react';
import { Database, Server } from 'lucide-react';
import Badge from '../../components/common/Badge';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content-primary">System Configuration</h1>
        <p className="text-xs text-content-secondary mt-1">
          Backend operational settings and security parameters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-6 rounded-xl border border-border-subtle bg-background-card space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <Server className="w-5 h-5" />
            <h2 className="text-sm font-semibold text-content-primary">API Service Status</h2>
          </div>
          <p className="text-xs text-content-secondary leading-relaxed">
            REST API routes and Mongoose models are connected to MongoDB Atlas. Security features including Helmet, CORS, Rate Limiting, and JWT authentication are active.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <Badge variant="success" size="xs">
              Operational
            </Badge>
            <span className="text-xs text-content-tertiary">Express 4.x + Mongoose 8.x</span>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border-subtle bg-background-card space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <Database className="w-5 h-5" />
            <h2 className="text-sm font-semibold text-content-primary">Database Hygiene</h2>
          </div>
          <p className="text-xs text-content-secondary leading-relaxed">
            All database credentials remain strictly confidential on the local environment and are never exposed to browser bundles or client requests.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <Badge variant="default" size="xs">
              Protected
            </Badge>
            <span className="text-xs text-content-tertiary">MongoDB Atlas Cluster</span>
          </div>
        </div>
      </div>
    </div>
  );
}
