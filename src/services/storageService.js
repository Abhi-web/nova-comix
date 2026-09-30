import api from './api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Storage and Upload Service for NOVA PANEL (Step 6)
 * Handles Google Drive uploads, multi-page batch queues, page reordering,
 * replacements, and chapter publishing lifecycle.
 */
export const storageService = {
  /**
   * Get relative or absolute stream URL for a file stored in Google Drive
   */
  getFileAccessUrl(fileIdOrUrl) {
    if (!fileIdOrUrl) return '';
    if (
      fileIdOrUrl.startsWith('http://') ||
      fileIdOrUrl.startsWith('https://') ||
      fileIdOrUrl.startsWith('data:') ||
      fileIdOrUrl.startsWith('blob:')
    ) {
      return fileIdOrUrl;
    }
    const cleanId = fileIdOrUrl.replace(/^\/?api\/reader\/pages\//, '').replace(/^\/+/, '');
    const cleanBase = API_URL.replace(/\/+$/, '');
    return `${cleanBase}/reader/pages/${cleanId}`;
  },

  /**
   * Get storage configuration status & quota
   */
  async getStatus() {
    return await api.get('/storage/status');
  },

  /**
   * Get Google OAuth 2.0 authorization URL for linking Drive
   */
  async getAuthUrl() {
    return await api.get('/storage/auth-url');
  },

  /**
   * Upload manga cover
   */
  async uploadCover(mangaId, file) {
    const formData = new FormData();
    formData.append('image', file);
    return await api.upload(`/admin/manga/${mangaId}/cover`, formData);
  },

  /**
   * Upload manga banner
   */
  async uploadBanner(mangaId, file) {
    const formData = new FormData();
    formData.append('image', file);
    return await api.upload(`/admin/manga/${mangaId}/banner`, formData);
  },

  /**
   * Upload chapter pages (batch/single)
   */
  async uploadChapterPages(chapterId, files) {
    const formData = new FormData();
    if (Array.isArray(files)) {
      files.forEach((file) => {
        formData.append('pages', file);
      });
    } else {
      formData.append('pages', files);
    }
    return await api.upload(`/admin/chapters/${chapterId}/pages`, formData);
  },

  /**
   * Reorder chapter pages
   */
  async reorderPages(chapterId, pageOrders) {
    return await api.put(`/admin/chapters/${chapterId}/reorder-pages`, { pageOrders });
  },

  /**
   * Replace an uploaded page (Upload first -> then delete old)
   */
  async replacePage(chapterId, pageId, file) {
    const formData = new FormData();
    formData.append('image', file);
    return await api.upload(`/admin/chapters/${chapterId}/replace-page/${pageId}`, formData, 'PUT');
  },

  /**
   * Delete a page
   */
  async deletePage(chapterId, pageId) {
    return await api.delete(`/admin/chapters/${chapterId}/pages/${pageId}`);
  },

  /**
   * Publish chapter with strict validation
   */
  async publishChapter(chapterId) {
    return await api.put(`/admin/chapters/${chapterId}/publish`);
  },

  /**
   * Unpublish chapter (set to draft)
   */
  async unpublishChapter(chapterId) {
    return await api.put(`/admin/chapters/${chapterId}/unpublish`);
  },

  /**
   * Delete chapter with Google Drive cleanup
   */
  async deleteChapter(chapterId) {
    return await api.delete(`/admin/chapters/${chapterId}`);
  },
};

export default storageService;
