import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import storageService from '../../services/storageService';
import { resolveImageUrl } from '../../utils/imageUrl';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import LoadingState from '../../components/common/LoadingState';

export default function AdminStoryFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    alternativeTitles: '',
    slug: '',
    type: 'manhwa',
    status: 'ongoing',
    description: '',
    author: '',
    artist: '',
    genres: '',
    rating: 8.5,
    views: 0,
    featured: false,
    coverImage: '',
    bannerImage: '',
  });

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      async function loadStory() {
        try {
          const res = await api.get(`/manga/${id}`);
          if (res.success && res.data) {
            const story = res.data;
            setFormData({
              title: story.title || '',
              alternativeTitles: Array.isArray(story.alternativeTitles)
                ? story.alternativeTitles.join(', ')
                : story.alternativeTitles || '',
              slug: story.slug || '',
              type: story.type || 'manhwa',
              status: story.status || 'ongoing',
              description: story.description || '',
              author: story.author || '',
              artist: story.artist || '',
              genres: Array.isArray(story.genres) ? story.genres.join(', ') : story.genres || '',
              rating: story.rating ?? 8.5,
              views: story.views ?? 0,
              featured: Boolean(story.featured),
              coverImage: story.coverImage || '',
              bannerImage: story.bannerImage || '',
            });
          }
        } catch (err) {
          toast.error(err.message || 'Failed to load story details');
          navigate('/admin/stories');
        } finally {
          setLoading(false);
        }
      }
      loadStory();
    }
  }, [id, isEditing, navigate, toast]);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Title is required';
    }
    if (!formData.type) {
      errs.type = 'Type is required';
    }
    const numRating = Number(formData.rating);
    if (isNaN(numRating) || numRating < 0 || numRating > 10) {
      errs.rating = 'Rating must be between 0 and 10';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        rating: Number(formData.rating),
        views: Number(formData.views) || 0,
        genres: formData.genres.split(',').map((g) => g.trim()).filter(Boolean),
        alternativeTitles: formData.alternativeTitles
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (isEditing) {
        await api.put(`/manga/${id}`, payload);
        toast.success(`Story '${formData.title}' updated successfully.`);
      } else {
        const createRes = await api.post('/manga', payload);
        const newMangaId = createRes.data?._id;

        // If files were selected during creation, upload them now
        if (newMangaId && formData.pendingCoverFile) {
          try {
            await storageService.uploadCover(newMangaId, formData.pendingCoverFile);
          } catch (covErr) {
            console.warn('Pending cover upload failed:', covErr.message);
          }
        }
        if (newMangaId && formData.pendingBannerFile) {
          try {
            await storageService.uploadBanner(newMangaId, formData.pendingBannerFile);
          } catch (banErr) {
            console.warn('Pending banner upload failed:', banErr.message);
          }
        }

        toast.success(`Story '${formData.title}' created successfully.`);
      }

      navigate('/admin/stories');
    } catch (err) {
      toast.error(err.message || 'Failed to save story');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingState message="Loading story editor..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/stories"
            className="p-2 rounded-lg text-content-tertiary hover:text-content-primary hover:bg-background-elevated transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-content-primary">
              {isEditing ? 'Edit Story' : 'Create New Story'}
            </h1>
            <p className="text-xs text-content-secondary mt-0.5">
              {isEditing
                ? 'Update story metadata, taxonomy, and artwork references'
                : 'Publish a new title into the NOVA PANEL repository'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Metadata Card */}
        <div className="p-6 sm:p-7 rounded-2xl border border-border-subtle bg-background-card/85 backdrop-blur-sm shadow-card space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-border-subtle">
            <span className="w-1.5 h-5 bg-accent rounded-full inline-block shadow-glow-accent/40" />
            <h2 className="text-sm font-bold text-content-primary uppercase tracking-wider text-accent">
              Core Story Metadata
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-content-secondary uppercase tracking-wider mb-2">
                Story Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Beyond the Last Horizon"
                className={`w-full px-4 py-3 text-sm bg-background-elevated/70 border rounded-xl text-content-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 ${
                  errors.title ? 'border-rose-500' : 'border-border-subtle focus:border-accent'
                }`}
              />
              {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
            </div>

            {/* Alternative Titles */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-content-secondary uppercase tracking-wider mb-2">
                Alternative Titles (comma-separated)
              </label>
              <input
                type="text"
                value={formData.alternativeTitles}
                onChange={(e) =>
                  setFormData({ ...formData, alternativeTitles: e.target.value })
                }
                placeholder="Last Horizon Saga, Saigo no Suiheisen"
                className="w-full px-4 py-3 text-sm bg-background-elevated/70 border border-border-subtle rounded-xl text-content-primary focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-200"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-medium text-content-secondary mb-1.5">
                Type / Format <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-background-elevated border border-border-subtle rounded-lg text-content-primary focus:outline-none focus:border-accent"
              >
                <option value="manhwa">Manhwa (South Korean)</option>
                <option value="manga">Manga (Japanese)</option>
                <option value="manhua">Manhua (Chinese)</option>
                <option value="webtoon">Webtoon (Vertical Scroll)</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-content-secondary mb-1.5">
                Publication Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-background-elevated border border-border-subtle rounded-lg text-content-primary focus:outline-none focus:border-accent"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="hiatus">Hiatus</option>
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-medium text-content-secondary mb-1.5">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Author or Studio name"
                className="w-full px-3.5 py-2.5 text-sm bg-background-elevated border border-border-subtle rounded-lg text-content-primary focus:outline-none focus:border-accent"
              />
            </div>

            {/* Artist */}
            <div>
              <label className="block text-xs font-medium text-content-secondary mb-1.5">
                Artist
              </label>
              <input
                type="text"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                placeholder="Artist or Illustrator"
                className="w-full px-3.5 py-2.5 text-sm bg-background-elevated border border-border-subtle rounded-lg text-content-primary focus:outline-none focus:border-accent"
              />
            </div>

            {/* Genres */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-content-secondary mb-1.5">
                Genres (comma-separated)
              </label>
              <input
                type="text"
                value={formData.genres}
                onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                placeholder="Fantasy, Action, Adventure, Mystery"
                className="w-full px-3.5 py-2.5 text-sm bg-background-elevated border border-border-subtle rounded-lg text-content-primary focus:outline-none focus:border-accent"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-content-secondary mb-1.5">
                Description / Synopsis
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed story premise and synopsis..."
                className="w-full px-3.5 py-2.5 text-sm bg-background-elevated border border-border-subtle rounded-lg text-content-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* Artwork & Promotion Card */}
        <div className="p-6 sm:p-7 rounded-2xl border border-border-subtle bg-background-card/85 backdrop-blur-sm shadow-card space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-border-subtle">
            <span className="w-1.5 h-5 bg-accent rounded-full inline-block shadow-glow-accent/40" />
            <h2 className="text-sm font-bold text-content-primary uppercase tracking-wider text-accent">
              Cover & Banner Artwork (Google Drive Cloud Storage)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cover Upload & Preview */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-content-secondary uppercase tracking-wider">
                Story Cover Image (JPG, PNG, WEBP)
              </label>
              
              <div className="flex items-start gap-4">
                {formData.coverImage ? (
                  <div className="w-20 h-28 rounded-xl overflow-hidden border border-border-subtle bg-background-elevated shrink-0 relative group shadow-card">
                    <img
                      src={resolveImageUrl(formData.coverImage)}
                      alt="Cover preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.opacity = '0.3';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-20 h-28 rounded-xl border-2 border-dashed border-border-subtle flex items-center justify-center text-content-tertiary text-xs shrink-0 font-medium">
                    No Cover
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    id="coverFileInput"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      // If editing an existing story, upload directly to Google Drive via backend
                      if (isEditing) {
                        try {
                          toast.info('Uploading cover to Google Drive...');
                          const res = await storageService.uploadCover(id, file);
                          if (res.success && res.data?.coverImage) {
                            setFormData((prev) => ({ ...prev, coverImage: res.data.coverImage }));
                            toast.success('Cover uploaded to Google Drive successfully!');
                          }
                        } catch (err) {
                          toast.error(err.message || 'Failed to upload cover to Google Drive');
                        }
                      } else {
                        // For new story, preview via object URL and save pending file
                        const previewUrl = URL.createObjectURL(file);
                        setFormData((prev) => ({ ...prev, coverImage: previewUrl, pendingCoverFile: file }));
                        toast.info('Cover selected. It will upload to Google Drive upon creating the story.');
                      }
                    }}
                  />
                  <label
                    htmlFor="coverFileInput"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-background-elevated hover:bg-background-cardHover border border-border-subtle text-content-primary cursor-pointer transition-colors"
                  >
                    Select Cover File...
                  </label>
                  <p className="text-[11px] text-content-tertiary">
                    Or paste direct image URL below:
                  </p>
                  <input
                    type="url"
                    value={formData.coverImage?.startsWith('blob:') ? '' : formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 text-xs bg-background-elevated border border-border-subtle rounded-lg text-content-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            {/* Banner Upload & Preview */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-content-secondary">
                Banner / Hero Artwork (JPG, PNG, WEBP)
              </label>

              <div className="flex items-start gap-4">
                {formData.bannerImage ? (
                  <div className="w-28 h-20 rounded-lg overflow-hidden border border-border-subtle bg-background-elevated shrink-0 relative group">
                    <img
                      src={resolveImageUrl(formData.bannerImage)}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.opacity = '0.3';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-28 h-20 rounded-lg border-2 border-dashed border-border-subtle flex items-center justify-center text-content-tertiary text-xs shrink-0">
                    No Banner
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <input
                    type="file"
                    id="bannerFileInput"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (isEditing) {
                        try {
                          toast.info('Uploading banner to Google Drive...');
                          const res = await storageService.uploadBanner(id, file);
                          if (res.success && res.data?.bannerImage) {
                            setFormData((prev) => ({ ...prev, bannerImage: res.data.bannerImage }));
                            toast.success('Banner uploaded to Google Drive successfully!');
                          }
                        } catch (err) {
                          toast.error(err.message || 'Failed to upload banner to Google Drive');
                        }
                      } else {
                        const previewUrl = URL.createObjectURL(file);
                        setFormData((prev) => ({ ...prev, bannerImage: previewUrl, pendingBannerFile: file }));
                        toast.info('Banner selected. It will upload to Google Drive upon creating the story.');
                      }
                    }}
                  />
                  <label
                    htmlFor="bannerFileInput"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-background-elevated hover:bg-background-cardHover border border-border-subtle text-content-primary cursor-pointer transition-colors"
                  >
                    Select Banner File...
                  </label>
                  <p className="text-[11px] text-content-tertiary">
                    Or paste direct image URL below:
                  </p>
                  <input
                    type="url"
                    value={formData.bannerImage?.startsWith('blob:') ? '' : formData.bannerImage}
                    onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 text-xs bg-background-elevated border border-border-subtle rounded-lg text-content-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-border-subtle/50">
            {/* Rating */}
            <div>
              <label className="block text-xs font-medium text-content-secondary mb-1.5">
                Rating (0.0 to 10.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-background-elevated border border-border-subtle rounded-lg text-content-primary focus:outline-none focus:border-accent"
              />
            </div>

            {/* Custom Slug (optional) */}
            <div>
              <label className="block text-xs font-medium text-content-secondary mb-1.5">
                URL Slug (Optional - auto-generated if blank)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="beyond-the-last-horizon"
                className="w-full px-3.5 py-2.5 text-sm bg-background-elevated border border-border-subtle rounded-lg text-content-primary focus:outline-none focus:border-accent"
              />
            </div>

            {/* Featured Toggle */}
            <div className="md:col-span-2 flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="featuredToggle"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded border-border-subtle text-accent focus:ring-accent"
              />
              <label htmlFor="featuredToggle" className="text-sm font-medium text-content-primary cursor-pointer">
                Mark as Featured Story (promoted on Home hero and featured carousel)
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
          <Link to="/admin/stories">
            <Button variant="ghost" type="button" disabled={submitting}>
              Cancel
            </Button>
          </Link>
          <Button
            variant="secondary"
            type="button"
            disabled={submitting}
            onClick={(e) => {
              setFormData((prev) => ({ ...prev, status: 'hiatus' }));
              handleSubmit(e);
            }}
          >
            Save as Hiatus / Draft
          </Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : isEditing ? 'Update Story' : 'Create Story'}
          </Button>
        </div>
      </form>
    </div>
  );
}
