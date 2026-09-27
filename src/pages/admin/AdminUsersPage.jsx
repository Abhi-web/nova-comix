import React from 'react';
import { Users, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../../components/common/Badge';

export default function AdminUsersPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-content-primary">Users & Access Control</h1>
        <p className="text-xs text-content-secondary mt-1">
          Platform role-based access management and administrator accounts
        </p>
      </div>

      <div className="rounded-xl border border-border-subtle bg-background-card overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border-subtle bg-background-elevated/40 text-content-tertiary uppercase tracking-wider font-semibold">
              <th className="py-3.5 px-4">User</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle/50 text-content-secondary">
            <tr className="hover:bg-background-elevated/30">
              <td className="py-3.5 px-4 font-semibold text-content-primary flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-xs font-bold">
                  {user?.name?.[0] || 'A'}
                </div>
                <span>{user?.name || 'Administrator'}</span>
              </td>
              <td className="py-3.5 px-4">{user?.email || 'admin@novapanel.local'}</td>
              <td className="py-3.5 px-4">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-accent/15 text-accent border border-accent/30">
                  <Shield className="w-3 h-3" />
                  {user?.role || 'admin'}
                </span>
              </td>
              <td className="py-3.5 px-4">
                <Badge variant="success" size="xs">
                  Active
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
