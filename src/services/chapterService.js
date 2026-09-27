import api from './api';

export const chapterService = {
  /**
   * Fetch chapters for a specific story
   */
  async getByManga(mangaId, params = {}) {
    const response = await api.get(`/manga/${mangaId}/chapters`, params);
    return response;
  },

  /**
   * Fetch a single chapter by ID
   */
  async getById(id) {
    const response = await api.get(`/chapters/${id}`);
    return response.data;
  },

  /**
   * Create a new chapter for a story
   */
  async create(mangaId, data) {
    const response = await api.post(`/manga/${mangaId}/chapters`, data);
    return response.data;
  },

  /**
   * Update a chapter
   */
  async update(id, data) {
    const response = await api.put(`/chapters/${id}`, data);
    return response.data;
  },

  /**
   * Delete a chapter
   */
  async delete(id) {
    const response = await api.delete(`/chapters/${id}`);
    return response;
  },

  /**
   * Toggle chapter publish status (draft <-> published)
   */
  async toggleStatus(id, currentStatus) {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    const response = await api.put(`/chapters/${id}`, { status: nextStatus });
    return response.data;
  },
};

export default chapterService;
