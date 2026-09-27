import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Layers,
  CheckCircle,
  FileEdit,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Activity,
  AlertCircle,
  RefreshCw,
  HardDrive,
  ExternalLink,
} from 'lucide-react';
import api from '../../services/api';
import storageService from '../../services/storageService';
import Skeleton from '../../components/common/Skeleton';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [storageStatus, setStorageStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, healthRes, storageRes] = await Promise.all([
        api.get('/manga/stats/dashboard'),
        api.get('/health'),
        storageService.getStatus().catch(() => ({ success: false, configured: false })),
      ]);

      if (statsRes.success) {
        setStats(statsRes.data);
      }
      if (healthRes.success) {
        setHealth(healthRes);
      }
      if (storageRes) {
        setStorageStatus(storageRes);
      }
    } catch (err) {
      setError(err.message || 'Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton variant="text" width="200px" height="28px" className="mb-2" />
          <Skeleton variant="text" width="300px" height="18px" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-xl border border-border-subtle bg-background-card">
              <Skeleton variant="text" width="80px" height="16px" className="mb-3" />
              <Skeleton variant="text" width="120px" height="32px" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton variant="rect" height="320px" />
          <Skeleton variant="rect" height="320px" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-xl border border-rose-500/20 bg-background-card text-center max-w-lg mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-content-primary mb-2">Unable to load data.</h3>
        <p className="text-sm text-content-secondary mb-6">{error}</p>
        <Button
          variant="primary"
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Total Stories',
      value: stats?.totalStories ?? 0,
      icon: BookOpen,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      borderColor: 'border-amber-400/20',
    },
    {
      title: 'Total Chapters',
      value: stats?.totalChapters ?? 0,
      icon: Layers,
      color: 'text-sky-400',
      bgColor: 'bg-sky-400/10',
      borderColor: 'border-sky-400/20',
    },
    {
      title: 'Published Stories',
      value: stats?.publishedStories ?? 0,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      borderColor: 'border-emerald-400/20',
    },
    {
      title: 'Draft Chapters',
      value: stats?.draftChapters ?? 0,
      icon: FileEdit,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with Title & Quick System Pill */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-content-primary">Dashboard Overview</h1>
          <p className="text-xs text-content-secondary mt-1">
            Real-time catalog metrics and platform status
          </p>
        </div>

        {health && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Atlas DB: {health.database}</span>
            <span className="text-white/20">|</span>
            <Activity className="w-3.5 h-3.5" />
            <span>API Online</span>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${card.borderColor} bg-background-card/85 backdrop-blur-sm shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover duration-300`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-content-secondary uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.color} shadow-inner`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 text-3xl font-extrabold text-content-primary tracking-tight font-mono">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Panel */}
      <div className="p-5 rounded-2xl border border-border-subtle bg-background-card/60 backdrop-blur-sm shadow-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-accent/15 text-accent">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-content-primary block">
              Quick Actions
            </span>
            <span className="text-[11px] text-content-muted">Catalog shortcuts</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/stories/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-accent text-background-primary hover:bg-accent/90 shadow-glow-accent/20 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            + Add Story
          </Link>
          <Link
            to="/admin/stories"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-background-elevated border border-border-subtle hover:border-border-strong text-content-primary transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-accent" />
            Manage Catalog
          </Link>
        </div>
      </div>

      {/* Google Drive Storage Status Card (Requirement 29) */}
      <div className="p-6 rounded-2xl border border-border-subtle bg-background-card/85 backdrop-blur-sm shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border-subtle">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-accent/15 border border-accent/30 text-accent shadow-glow-accent/10">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-content-primary">Google Drive Cloud Storage</h2>
              <p className="text-xs text-content-secondary mt-0.5">Primary storage for covers, banners, and real chapter page streams</p>
            </div>
          </div>

          <div>
            {storageStatus?.configured ? (
              <Badge variant="success" size="sm">
                Google Drive Connected
              </Badge>
            ) : (
              <Badge variant="warning" size="sm">
                Setup Required
              </Badge>
            )}
          </div>
        </div>

        <div className="pt-4">
          {storageStatus?.configured ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-background-elevated border border-border-subtle/60">
                  <span className="text-content-tertiary block mb-0.5">Root Storage Folder:</span>
                  <span className="font-mono text-content-primary font-medium truncate block">
                    {storageStatus.rootFolderName || 'NOVA_PANEL_STORAGE'}
                  </span>
                  <span className="font-mono text-[10px] text-content-muted truncate block">
                    ID: {storageStatus.rootFolderId || 'Configured'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-background-elevated border border-border-subtle/60">
                  <span className="text-content-tertiary block mb-0.5">Authorized Account:</span>
                  <span className="font-medium text-content-primary truncate block">
                    {storageStatus.user?.emailAddress || 'Personal Google Drive'}
                  </span>
                  <span className="text-[10px] text-emerald-400">
                    {storageStatus.user?.displayName ? `Owner: ${storageStatus.user.displayName}` : 'OAuth 2.0 Offline Access'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-background-elevated border border-border-subtle/60">
                  <span className="text-content-tertiary block mb-0.5">Storage Quota:</span>
                  {storageStatus.storageQuota?.limit ? (
                    <div>
                      <span className="font-medium text-content-primary block">
                        {(Number(storageStatus.storageQuota.usageInDrive || storageStatus.storageQuota.usage || 0) / (1024 * 1024 * 1024)).toFixed(2)} GB used
                      </span>
                      <span className="text-[10px] text-content-secondary">
                        of {(Number(storageStatus.storageQuota.limit) / (1024 * 1024 * 1024)).toFixed(0)} GB total
                      </span>
                    </div>
                  ) : (
                    <span className="text-content-secondary italic">Storage information unavailable</span>
                  )}
                </div>
              </div>

              {storageStatus.storageQuota?.limit && (
                <div className="space-y-1 pt-1">
                  <div className="w-full bg-background-elevated rounded-full h-2 overflow-hidden border border-border-subtle/40">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            (Number(storageStatus.storageQuota.usageInDrive || storageStatus.storageQuota.usage || 0) /
                              Number(storageStatus.storageQuota.limit)) *
                              100
                          )
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-2">
              <p className="font-semibold text-amber-200">
                Google Drive Storage credentials have not been configured in backend/.env yet.
              </p>
              <p className="text-amber-300/80 leading-relaxed">
                To activate real uploads, configure <code>GOOGLE_CLIENT_ID</code>, <code>GOOGLE_CLIENT_SECRET</code>, <code>GOOGLE_REFRESH_TOKEN</code>, and <code>GOOGLE_DRIVE_ROOT_FOLDER_ID</code> in <code>backend/.env</code>.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity: Stories and Chapters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Stories */}
        <div className="p-6 rounded-2xl border border-border-subtle bg-background-card/85 backdrop-blur-sm shadow-card">
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
            <h2 className="text-sm font-bold text-content-primary flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              Recent Stories
            </h2>
            <Link
              to="/admin/stories"
              className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border-subtle/50 mt-3">
            {stats?.recentStories && stats.recentStories.length > 0 ? (
              stats.recentStories.map((story) => (
                <div key={story._id} className="py-3.5 flex items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={story.coverImage || 'https://via.placeholder.com/60x80'}
                      alt={story.title}
                      className="w-11 h-14 object-cover rounded-xl bg-background-elevated shrink-0 border border-white/5"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-content-primary truncate group-hover:text-accent transition-colors">
                        {story.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                          {story.type}
                        </span>
                        <span className="text-content-tertiary">•</span>
                        <Badge
                          variant={story.status === 'completed' ? 'success' : 'default'}
                          size="xs"
                        >
                          {story.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/admin/stories/${story._id}/edit`}
                    className="px-3 py-1 text-xs text-content-secondary hover:text-content-primary rounded-lg hover:bg-background-elevated font-semibold transition-colors border border-transparent hover:border-border-subtle"
                  >
                    Edit
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-xs text-content-tertiary py-8 text-center">
                No stories published yet.
              </p>
            )}
          </div>
        </div>

        {/* Recent Chapters */}
        <div className="p-6 rounded-2xl border border-border-subtle bg-background-card/85 backdrop-blur-sm shadow-card">
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
            <h2 className="text-sm font-bold text-content-primary flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent" />
              Recent Chapters
            </h2>
            <Link
              to="/admin/stories"
              className="text-xs text-accent hover:underline flex items-center gap-1 font-semibold"
            >
              Stories
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border-subtle/50 mt-3">
            {stats?.recentChapters && stats.recentChapters.length > 0 ? (
              stats.recentChapters.map((chapter) => (
                <div key={chapter._id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-content-primary truncate">
                      {chapter.mangaId?.title || 'Unknown Story'}
                    </p>
                    <p className="text-xs text-content-secondary mt-0.5">
                      Chapter {chapter.number} {chapter.title ? `— ${chapter.title}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <Badge
                      variant={chapter.status === 'published' ? 'success' : 'warning'}
                      size="xs"
                    >
                      {chapter.status}
                    </Badge>
                    <span className="text-[11px] text-content-tertiary font-mono">
                      {new Date(chapter.publishedAt || chapter.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-content-tertiary py-8 text-center">
                No chapters added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
