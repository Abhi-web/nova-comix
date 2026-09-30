import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  PlusCircle,
  Layers,
  Edit,
  Trash2,
  AlertTriangle,
  AlertCircle,
  Calendar,
  Images,
} from 'lucide-react';
import api from '../../services/api';
import chapterService from '../../services/chapterService';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';
import { resolveImageUrl } from '../../utils/imageUrl';

export default function AdminChaptersPage() {
  const { id: mangaId } = useParams();
  const toast = useToast();

  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, chapter: null, isDeleting: false });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [storyRes, chaptersRes] = await Promise.all([
        api.get(`/manga/${mangaId}`),
        chapterService.getByManga(mangaId, { limit: 100, sort: sortOrder, status: 'all' }),
      ]);

      if (storyRes.success) setStory(storyRes.data);
      if (chaptersRes.success) setChapters(chaptersRes.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load chapters.');
    } finally {
      setLoading(false);
    }
  }, [mangaId, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTogglePublish = async (chapter) => {
    try {
      const nextStatus = chapter.status === 'published' ? 'draft' : 'published';
      await chapterService.update(chapter._id, { status: nextStatus });
      toast.success(
        `Chapter ${chapter.number} status changed to ${nextStatus === 'published' ? 'Published' : 'Draft'}.`
      );
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to update chapter status');
    }
  };

  const handleDeleteChapter = async () => {
    if (!deleteModal.chapter) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      await chapterService.delete(deleteModal.chapter._id);
      toast.success(`Chapter ${deleteModal.chapter.number} deleted successfully.`);
      setDeleteModal({ isOpen: false, chapter: null, isDeleting: false });
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete chapter');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  if (loading && !story) {
    return (
      <div className="space-y-6">
        <Skeleton variant="rect" height="120px" />
        <Skeleton variant="rect" height="300px" />
      </div>
    );
  }

  if (error && !story) {
    return (
      <div className="p-8 rounded-xl border border-rose-500/20 bg-background-card text-center max-w-lg mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-content-primary mb-1">Unable to load data.</h3>
        <p className="text-xs text-content-secondary mb-4">{error}</p>
        <Button variant="primary" size="sm" onClick={fetchData}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation & Story Header Card */}
      <div className="flex items-center gap-3">
        <Link
          to="/admin/stories"
          className="p-2 rounded-lg text-content-tertiary hover:text-content-primary hover:bg-background-elevated transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-content-primary truncate">
            {story?.title || 'Story Chapters'}
          </h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Manage release schedule, publish state, and chapter archives
          </p>
        </div>
      </div>

      {/* Story Summary Card */}
      {story && (
        <div className="p-6 rounded-2xl border border-border-subtle bg-background-card/85 backdrop-blur-sm shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={resolveImageUrl(story.coverImage) || 'https://via.placeholder.com/60x80'}
              alt={story.title}
              className="w-14 h-20 object-cover rounded-xl bg-background-elevated border border-border-subtle shrink-0 shadow-card"
            />
            <div>
              <h2 className="font-extrabold text-content-primary text-base sm:text-lg tracking-tight">{story.title}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-content-secondary">
                <span className="uppercase tracking-wider font-bold text-[10px] text-accent px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                  {story.type}
                </span>
                <span>•</span>
                <Badge
                  variant={story.status === 'completed' ? 'success' : 'default'}
                  size="xs"
                >
                  {story.status}
                </Badge>
                <span>•</span>
                <span className="font-semibold text-content-primary font-mono">{chapters.length} Total Chapters</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <Link
              to={`/admin/stories/${mangaId}/chapters/new`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-accent text-background-primary hover:bg-accent/90 shadow-glow-accent/20 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              + Add Chapter
            </Link>
          </div>
        </div>
      )}

      {/* Chapters Management Section */}
      <div className="rounded-2xl border border-border-subtle bg-background-card/85 backdrop-blur-sm shadow-card overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 sm:p-5 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-bold text-content-primary">
              All Chapters ({chapters.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-content-tertiary">Sort:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-2.5 py-1 text-xs bg-background-elevated border border-border-subtle rounded-md text-content-secondary focus:outline-none focus:border-accent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Chapters Table / List */}
        {chapters.length === 0 ? (
          <div className="p-12 text-center">
            <Layers className="w-10 h-10 text-content-tertiary mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium text-content-secondary">
              No chapters have been created for this story yet.
            </p>
            <Link
              to={`/admin/stories/${mangaId}/chapters/new`}
              className="text-xs text-accent hover:underline mt-2 inline-block"
            >
              Create first chapter
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border-subtle/50">
            {chapters.map((chapter) => (
              <div
                key={chapter._id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-background-elevated/20 transition-colors"
              >
                {/* Chapter Title & Number */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-content-primary text-sm">
                      Chapter {chapter.number}
                    </span>
                    {chapter.title && (
                      <span className="text-xs text-content-secondary truncate">
                        — {chapter.title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-content-tertiary">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(chapter.publishedAt || chapter.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{chapter.pages?.length || 0} Pages</span>
                  </div>
                </div>

                {/* Status Badge & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border-subtle/40">
                  <Badge
                    variant={chapter.status === 'published' ? 'success' : 'warning'}
                    size="xs"
                  >
                    {chapter.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>

                  <div className="flex items-center gap-1.5">
                    {/* Manage Pages Direct Link */}
                    <Link
                      to={`/admin/stories/${mangaId}/chapters/${chapter._id}/edit`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded bg-background-elevated hover:bg-background-elevated/80 text-content-primary transition-colors border border-border-subtle"
                      title="Manage Chapter Pages & Uploads"
                    >
                      <Images className="w-3.5 h-3.5 text-accent" />
                      <span>Pages ({chapter.pages?.length || 0})</span>
                    </Link>

                    {/* Publish / Unpublish Toggle */}
                    <button
                      onClick={() => handleTogglePublish(chapter)}
                      className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                        chapter.status === 'published'
                          ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                      }`}
                      title={chapter.status === 'published' ? 'Set as Draft' : 'Publish Chapter'}
                    >
                      {chapter.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>

                    {/* Edit */}
                    <Link
                      to={`/admin/stories/${mangaId}/chapters/${chapter._id}/edit`}
                      className="p-1.5 rounded hover:bg-background-elevated text-content-secondary hover:text-content-primary transition-colors"
                      title="Edit Chapter"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    {/* Delete */}
                    <button
                      onClick={() =>
                        setDeleteModal({ isOpen: true, chapter, isDeleting: false })
                      }
                      className="p-1.5 rounded hover:bg-rose-500/10 text-content-tertiary hover:text-rose-400 transition-colors"
                      title="Delete Chapter"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-background-card border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-content-primary">Delete Chapter?</h3>
                <p className="text-xs text-rose-400 font-medium">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-content-secondary leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-content-primary">
                Chapter {deleteModal.chapter?.number}
              </span>{' '}
              from "{story?.title}"?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
              <Button
                variant="ghost"
                size="sm"
                disabled={deleteModal.isDeleting}
                onClick={() => setDeleteModal({ isOpen: false, chapter: null, isDeleting: false })}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={deleteModal.isDeleting}
                onClick={handleDeleteChapter}
                className="bg-rose-600 hover:bg-rose-700 text-white"
              >
                {deleteModal.isDeleting ? 'Deleting...' : 'Delete Chapter'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
