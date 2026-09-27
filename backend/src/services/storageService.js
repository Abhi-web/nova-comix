import googleDriveService from './googleDriveService.js';

/**
 * Storage Service Abstraction Layer for NOVA PANEL
 * Decouples reader and frontend from underlying storage vendor (Google Drive / S3 / R2).
 */
export const storageService = {
  /**
   * Returns relative API proxy URL for an uploaded file
   * E.g. /api/reader/pages/1v7a...
   */
  getFileAccessUrl(fileId) {
    if (!fileId) return '';
    return `/api/reader/pages/${fileId}`;
  },

  /**
   * Check if storage backend is configured and ready
   */
  isConfigured() {
    return googleDriveService.isConfigured();
  },

  /**
   * Retrieve storage provider quota (used vs available)
   */
  async getQuota() {
    return await googleDriveService.getStorageQuota();
  },

  /**
   * Upload file into Google Drive
   */
  async uploadFile(options) {
    return await googleDriveService.uploadFile(options);
  },

  /**
   * Delete file from Google Drive
   */
  async deleteFile(fileId) {
    return await googleDriveService.deleteFile(fileId);
  },

  /**
   * Stream file from storage
   */
  async getFileStream(fileId) {
    return await googleDriveService.getFileStream(fileId);
  },
};

export default storageService;
