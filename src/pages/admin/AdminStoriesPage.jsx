import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Trash2,
  Edit,
  Layers,
  Star,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Skeleton from '../../components/common/Skeleton';
import { resolveImageUrl } from '../../utils/imageUrl';

export default function AdminStoriesPage() {
  const toast = useToast();
  const [stories, setStories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');

  // Deletion modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, story: null, isDeleting: false });

  const fetchStories = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/manga', {
        page,
        limit: 10,
        search,
        type,
        status,
        sort,
      });

      if (response.success) {
        setStories(response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      setError(err.message || 'Unable to load stories.');
    } finally {
      setLoading(false);
    }
  }, [search, type, status, sort]);

  useEffect(() => {
    fetchStories(1);
  }, [fetchStories]);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.story) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      await api.delete(`/manga/${deleteModal.story._id}`);
      toast.success(`'${deleteModal.story.title}' was deleted successfully.`);
      setDeleteModal({ isOpen: false, story: null, isDeleting: false });
      // Refresh list
      fetchStories(pagination.page);
    } catch (err) {
      toast.error(err.message || 'Failed to delete story');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-content-primary">Story Catalog</h1>
          <p className="text-xs text-content-secondary mt-1">
            Manage titles, metadata, chapters, and publication status
          </p>
        </div>
        <Link
          to="/admin/stories/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-accent text-background-primary hover:bg-accent/90 transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          + Add New Story
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border-subtle bg-background-card/85 backdrop-blur-sm shadow-card flex flex-col md:flex-row gap-3.5 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-accent absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search title, author, genres..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-background-elevated/70 border border-border-subtle rounded-xl text-content-primary placeholder-content-tertiary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2 text-xs bg-background-elevated/70 border border-border-subtle rounded-xl text-content-secondary hover:text-content-primary focus:outline-none focus:border-accent transition-colors cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="manga">Manga</option>
            <option value="manhwa">Manhwa</option>
            <option value="manhua">Manhua</option>
            <option value="webtoon">Webtoon</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-background-elevated/70 border border-border-subtle rounded-xl text-content-secondary hover:text-content-primary focus:outline-none focus:border-accent transition-colors cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="hiatus">Hiatus</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 text-xs bg-background-elevated/70 border border-border-subtle rounded-xl text-content-secondary hover:text-content-primary focus:outline-none focus:border-accent transition-colors cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Views</option>
            <option value="rating">Highest Rated</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rect" height="72px" />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 rounded-xl border border-rose-500/20 bg-background-card text-center max-w-lg mx-auto my-8">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-content-primary mb-1">Unable to load data.</h3>
          <p className="text-xs text-content-secondary mb-4">{error}</p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => fetchStories(pagination.page)}
            className="inline-flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </Button>
        </div>
      ) : stories.length === 0 ? (
        <div className="p-12 rounded-xl border border-border-subtle bg-background-card text-center">
          <p className="text-sm font-medium text-content-secondary">No stories found matching your criteria.</p>
          <button
            onClick={() => {
              setSearch('');
              setType('');
              setStatus('');
              setSort('newest');
            }}
            className="text-xs text-accent hover:underline mt-2 inline-block"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View (Hidden on mobile) */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-border-subtle bg-background-card/85 backdrop-blur-sm shadow-card">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border-subtle bg-background-elevated/60 text-content-tertiary uppercase tracking-wider font-bold">
                  <th className="py-4 px-4 w-16">Cover</th>
                  <th className="py-4 px-4">Title</th>
                  <th className="py-4 px-3">Type</th>
                  <th className="py-4 px-3">Status</th>
                  <th className="py-4 px-3">Rating</th>
                  <th className="py-4 px-3">Chapters</th>
                  <th className="py-4 px-3">Updated</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/50 text-content-secondary">
                {stories.map((story) => (
                  <tr
                    key={story._id}
                    className="hover:bg-background-elevated/40 transition-colors group"
                  >
                    {/* Cover */}
                    <td className="py-3 px-4">
                      <img
                        src={resolveImageUrl(story.coverImage) || 'https://via.placeholder.com/60x80'}
                        alt={story.title}
                        className="w-10 h-14 object-cover rounded-xl bg-background-elevated border border-border-subtle group-hover:scale-105 transition-transform duration-300"
                      />
                    </td>

                    {/* Title */}
                    <td className="py-3 px-4 min-w-[180px]">
                      <div className="font-bold text-content-primary text-sm line-clamp-1 group-hover:text-accent transition-colors">
                        {story.title}
                      </div>
                      <div className="text-[11px] text-content-tertiary line-clamp-1 mt-0.5 font-medium">
                        {story.author || 'Author unknown'}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-3 uppercase tracking-wider font-medium text-[11px]">
                      {story.type}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <Badge
                        variant={story.status === 'completed' ? 'success' : story.status === 'hiatus' ? 'warning' : 'default'}
                        size="xs"
                      >
                        {story.status}
                      </Badge>
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-content-primary">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        {story.rating?.toFixed(1) || '0.0'}
                      </span>
                    </td>

                    {/* Chapters */}
                    <td className="py-3 px-3 font-medium text-content-primary">
                      {story.chaptersCount ?? 0}
                    </td>

                    {/* Updated */}
                    <td className="py-3 px-3 text-[11px] text-content-tertiary">
                      {new Date(story.updatedAt || story.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Link
                          to={`/admin/stories/${story._id}/chapters`}
                          className="p-1.5 rounded hover:bg-background-elevated text-content-secondary hover:text-accent transition-colors"
                          title="Manage Chapters"
                        >
                          <Layers className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/stories/${story._id}/edit`}
                          className="p-1.5 rounded hover:bg-background-elevated text-content-secondary hover:text-content-primary transition-colors"
                          title="Edit Story"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, story, isDeleting: false })}
                          className="p-1.5 rounded hover:bg-rose-500/10 text-content-tertiary hover:text-rose-400 transition-colors"
                          title="Delete Story"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (Shown on screens < md) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {stories.map((story) => (
              <div
                key={story._id}
                className="p-4 rounded-xl border border-border-subtle bg-background-card space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={resolveImageUrl(story.coverImage) || 'https://via.placeholder.com/60x80'}
                    alt={story.title}
                    className="w-14 h-20 object-cover rounded bg-background-elevated border border-border-subtle shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-content-primary text-sm line-clamp-1">
                      {story.title}
                    </h3>
                    <p className="text-xs text-content-tertiary mt-0.5">{story.author}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="default" size="xs">
                        {story.type}
                      </Badge>
                      <Badge
                        variant={story.status === 'completed' ? 'success' : 'default'}
                        size="xs"
                      >
                        {story.status}
                      </Badge>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-content-primary">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        {story.rating?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border-subtle/50 text-xs">
                  <span className="text-content-tertiary">
                    {story.chaptersCount ?? 0} Chapters
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/stories/${story._id}/chapters`}
                      className="px-2.5 py-1 rounded bg-background-elevated text-xs font-medium text-accent hover:bg-accent/10"
                    >
                      Chapters
                    </Link>
                    <Link
                      to={`/admin/stories/${story._id}/edit`}
                      className="p-1.5 rounded text-content-secondary hover:text-content-primary hover:bg-background-elevated"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, story, isDeleting: false })}
                      className="p-1.5 rounded text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
              <span className="text-xs text-content-secondary">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchStories(pagination.page - 1)}
                  className="px-2.5 py-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchStories(pagination.page + 1)}
                  className="px-2.5 py-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-background-card border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-content-primary">Delete this story?</h3>
                <p className="text-xs text-rose-400 font-medium">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-content-secondary leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <span className="font-semibold text-content-primary">
                "{deleteModal.story?.title}"
              </span>
              ? All associated chapters and archival records will also be removed.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
              <Button
                variant="ghost"
                size="sm"
                disabled={deleteModal.isDeleting}
                onClick={() => setDeleteModal({ isOpen: false, story: null, isDeleting: false })}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={deleteModal.isDeleting}
                onClick={handleDeleteConfirm}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                {deleteModal.isDeleting ? 'Deleting...' : 'Delete Story'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
