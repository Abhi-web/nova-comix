import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import api from '../../services/api';
import chapterService from '../../services/chapterService';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';
import AdminChapterPagesManager from '../../components/admin/AdminChapterPagesManager';

export default function AdminChapterFormPage() {
  const { id: mangaId, chapterId } = useParams();
  const isEditing = Boolean(chapterId);
  const navigate = useNavigate();
  const toast = useToast();

  const [story, setStory] = useState(null);
  const [chapterData, setChapterData] = useState(null);
  const [formData, setFormData] = useState({
    number: '',
    title: '',
    status: 'draft',
    publishedAt: new Date().toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const loadData = async () => {
    try {
      const storyRes = await api.get(`/manga/${mangaId}`);
      if (storyRes.success) setStory(storyRes.data);

      if (isEditing) {
        const chapter = await chapterService.getById(chapterId);
        if (chapter) {
          setChapterData(chapter);
          setFormData({
            number: chapter.number ?? '',
            title: chapter.title || '',
            status: chapter.status || 'draft',
            publishedAt: chapter.publishedAt
              ? new Date(chapter.publishedAt).toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0],
          });
        }
      } else {
        // Suggest next chapter number
        const chaptersRes = await chapterService.getByManga(mangaId, { limit: 1, sort: 'newest' });
        if (chaptersRes.success && chaptersRes.data && chaptersRes.data.length > 0) {
          const lastNum = chaptersRes.data[0].number || 0;
          setFormData((prev) => ({ ...prev, number: lastNum + 1 }));
        } else {
          setFormData((prev) => ({ ...prev, number: 1 }));
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load chapter information');
      navigate(`/admin/stories/${mangaId}/chapters`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [mangaId, chapterId, isEditing, navigate]);

  const validate = () => {
    const errs = {};
    if (formData.number === '' || formData.number === null || isNaN(Number(formData.number))) {
      errs.number = 'Valid chapter number is required';
    } else if (Number(formData.number) < 0) {
      errs.number = 'Chapter number cannot be negative';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (targetStatus) => {
    if (!validate()) return;
    setSubmitting(true);

    try {
      const payload = {
        number: Number(formData.number),
        title: formData.title.trim(),
        status: targetStatus || formData.status,
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt) : new Date(),
      };

      if (isEditing) {
        await chapterService.update(chapterId, payload);
        toast.success(`Chapter ${payload.number} updated successfully.`);
        loadData();
      } else {
        const createdRes = await chapterService.create(mangaId, payload);
        toast.success(`Chapter ${payload.number} created as Draft! You can now upload pages.`);
        const newId = createdRes._id || createdRes.data?._id;
        if (newId) {
          navigate(`/admin/stories/${mangaId}/chapters/${newId}/edit`);
          return;
        }
        navigate(`/admin/stories/${mangaId}/chapters`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save chapter');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingState message="Loading chapter editor..." />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to={`/admin/stories/${mangaId}/chapters`}
          className="p-2 rounded-lg text-content-tertiary hover:text-content-primary hover:bg-background-elevated transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-content-primary">
            {isEditing ? `Edit Chapter ${formData.number}` : 'Add New Chapter'}
          </h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Story: <span className="font-semibold text-content-primary">{story?.title}</span>
          </p>
        </div>
      </div>

      {/* Chapter Form Card */}
      <div className="p-6 rounded-xl border border-border-subtle bg-background-card space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Chapter Number */}
          <div>
            <label className="block text-xs font-medium text-content-secondary mb-1.5">
              Chapter Number <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              step="any"
              min="0"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              placeholder="e.g. 1 or 12.5"
              className={`w-full px-3.5 py-2.5 text-sm bg-background-elevated border rounded-lg text-content-primary focus:outline-none ${
                errors.number ? 'border-rose-500' : 'border-border-subtle focus:border-accent'
              }`}
            />
            {errors.number && <p className="text-xs text-rose-400 mt-1">{errors.number}</p>}
          </div>

          {/* Status Selector */}
          <div>
            <label className="block text-xs font-medium text-content-secondary mb-1.5">
              Initial Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-background-elevated border border-border-subtle rounded-lg text-content-primary focus:outline-none focus:border-accent"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Chapter Title */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-content-secondary mb-1.5">
              Chapter Title (Optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. The Awakening of the Prime Lattice"
              className="w-full px-3.5 py-2.5 text-sm bg-background-elevated border border-border-subtle rounded-lg text-content-primary focus:outline-none focus:border-accent"
            />
          </div>

          {/* Publish Date */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-content-secondary mb-1.5">
              Publish Date
            </label>
            <input
              type="date"
              value={formData.publishedAt}
              onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-background-elevated border border-border-subtle rounded-lg text-content-primary focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
          <Link to={`/admin/stories/${mangaId}/chapters`}>
            <Button variant="ghost" type="button" disabled={submitting}>
              Back to Chapters
            </Button>
          </Link>
          {isEditing ? (
            <Button
              variant="primary"
              type="button"
              disabled={submitting}
              onClick={() => handleSave()}
            >
              {submitting ? 'Saving...' : 'Update Chapter Details'}
            </Button>
          ) : (
            <Button
              variant="primary"
              type="button"
              disabled={submitting}
              onClick={() => handleSave('draft')}
            >
              {submitting ? 'Creating...' : 'Create Draft & Upload Pages →'}
            </Button>
          )}
        </div>
      </div>

      {/* Pages Management Section (Step 6) */}
      {isEditing && chapterData && (
        <div className="pt-2">
          <AdminChapterPagesManager
            chapter={chapterData}
            manga={story}
            onChapterUpdated={loadData}
          />
        </div>
      )}
    </div>
  );
}
