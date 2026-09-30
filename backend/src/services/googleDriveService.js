import { google } from 'googleapis';
import { Readable } from 'stream';

/**
 * Google Drive Service for NOVA PANEL
 * Manages OAuth 2.0 offline authorization, folder hierarchy,
 * safe streaming uploads, reordering, replacements, and secure stream access.
 */
class GoogleDriveService {
  constructor() {
    this.drive = null;
    this.oauth2Client = null;
    this.rootFolderId = null;
    this._initialized = false;
    this.folderCache = new Map();
  }

  isConfigured() {
    return Boolean(
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN &&
      process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID
    );
  }

  getOAuth2Client() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/storage/oauth2callback';

    if (!clientId || !clientSecret) {
      throw new Error(
        'Google Drive OAuth configuration missing. Please define GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env'
      );
    }

    return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  }

  getAuthUrl() {
    const oauth2Client = this.getOAuth2Client();
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive',
      ],
    });
  }

  async getTokensFromCode(code) {
    const oauth2Client = this.getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  }

  initialize() {
    if (!this.isConfigured()) {
      return null;
    }

    if (this._initialized && this.drive) {
      return this.drive;
    }

    try {
      const oauth2Client = this.getOAuth2Client();
      oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      });

      this.oauth2Client = oauth2Client;
      this.drive = google.drive({ version: 'v3', auth: oauth2Client });
      this.rootFolderId = process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
      this._initialized = true;

      return this.drive;
    } catch (err) {
      console.error('Failed to initialize Google Drive service:', err.message);
      this.drive = null;
      this._initialized = false;
      return null;
    }
  }

  async verifyRootFolder() {
    const drive = this.initialize();
    if (!drive) {
      throw new Error(
        'Google Drive is not fully configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, and GOOGLE_DRIVE_ROOT_FOLDER_ID in backend/.env'
      );
    }

    try {
      const response = await drive.files.get({
        fileId: this.rootFolderId,
        fields: 'id, name, mimeType, trashed',
      });

      if (response.data.trashed) {
        throw new Error('Configured root folder is in Google Drive trash');
      }

      if (response.data.mimeType !== 'application/vnd.google-apps.folder') {
        throw new Error('Configured GOOGLE_DRIVE_ROOT_FOLDER_ID is not a folder');
      }

      return response.data;
    } catch (err) {
      throw new Error(
        `Unable to access root folder (${this.rootFolderId}): ${err.message || 'Folder not found or permission denied'}`
      );
    }
  }

  async findFolder(name, parentFolderId) {
    const cacheKey = `${parentFolderId}::${name}`;
    if (this.folderCache.has(cacheKey)) {
      return this.folderCache.get(cacheKey);
    }

    const drive = this.initialize();
    if (!drive) return null;

    const query = [
      `name = '${name.replace(/'/g, "\\'")}'`,
      `'${parentFolderId}' in parents`,
      "mimeType = 'application/vnd.google-apps.folder'",
      'trashed = false',
    ].join(' and ');

    const res = await drive.files.list({
      q: query,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    if (res.data.files && res.data.files.length > 0) {
      const folderId = res.data.files[0].id;
      this.folderCache.set(cacheKey, folderId);
      return folderId;
    }
    return null;
  }

  async createFolder(name, parentFolderId) {
    const drive = this.initialize();
    if (!drive) {
      throw new Error('Google Drive client is not initialized');
    }

    const fileMetadata = {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId],
    };

    const res = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id, name',
    });

    const folderId = res.data.id;
    const cacheKey = `${parentFolderId}::${name}`;
    this.folderCache.set(cacheKey, folderId);
    return folderId;
  }

  getRootFolderId() {
    return this.rootFolderId || process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;
  }

  async ensureFolder(name, parentFolderId) {
    const existing = await this.findFolder(name, parentFolderId);
    if (existing) return existing;
    return await this.createFolder(name, parentFolderId);
  }

  async ensureMangaFolder(mangaSlug) {
    this.initialize();
    const rootId = this.getRootFolderId();
    if (!rootId) {
      throw new Error('GOOGLE_DRIVE_ROOT_FOLDER_ID is not configured');
    }

    // 1. Ensure NOVA_PANEL_STORAGE/manga/
    const mangaBaseFolderId = await this.ensureFolder('manga', rootId);

    // 2. Ensure NOVA_PANEL_STORAGE/manga/<mangaSlug>/
    const mangaFolderId = await this.ensureFolder(mangaSlug, mangaBaseFolderId);

    // 3. Ensure subfolders: cover, banner, chapters
    const [coverFolderId, bannerFolderId, chaptersFolderId] = await Promise.all([
      this.ensureFolder('cover', mangaFolderId),
      this.ensureFolder('banner', mangaFolderId),
      this.ensureFolder('chapters', mangaFolderId),
    ]);

    return {
      mangaFolderId,
      coverFolderId,
      bannerFolderId,
      chaptersFolderId,
    };
  }

  async ensureChapterFolder(mangaSlug, chapterNumber) {
    this.initialize();
    const { chaptersFolderId } = await this.ensureMangaFolder(mangaSlug);
    const chapterFolderName = `chapter-${String(chapterNumber).padStart(3, '0')}`;
    const chapterFolderId = await this.ensureFolder(chapterFolderName, chaptersFolderId);
    return chapterFolderId;
  }

  async uploadFile({ fileBuffer, fileName, mimeType, parentFolderId }) {
    const drive = this.initialize();
    if (!drive) {
      throw new Error('Google Drive is not configured');
    }

    const readable = new Readable();
    readable.push(fileBuffer);
    readable.push(null);

    const fileMetadata = {
      name: fileName,
      parents: [parentFolderId],
    };

    const media = {
      mimeType: mimeType || 'image/jpeg',
      body: readable,
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id, name, mimeType, size, createdTime',
    });

    return {
      fileId: response.data.id,
      name: response.data.name,
      mimeType: response.data.mimeType,
      size: parseInt(response.data.size, 10) || fileBuffer.length,
      createdAt: response.data.createdTime || new Date().toISOString(),
    };
  }

  async replaceFile(oldFileId, newFileData) {
    // Correct Order Requirement:
    // 1. Upload new file first
    // 2. Confirm successful upload
    // 3. Delete old file only after new file is secured
    const uploaded = await this.uploadFile(newFileData);

    if (oldFileId) {
      try {
        await this.deleteFile(oldFileId);
      } catch (err) {
        console.warn(`Failed to delete replaced old file ${oldFileId}:`, err.message);
      }
    }

    return uploaded;
  }

  async deleteFile(fileId) {
    const drive = this.initialize();
    if (!drive) return false;

    try {
      await drive.files.delete({
        fileId,
      });
      return true;
    } catch (err) {
      // If already deleted or 404, don't throw fatal error
      if (err.status === 404 || err.code === 404) {
        return true;
      }
      throw err;
    }
  }

  async getFileStream(fileId) {
    const drive = this.initialize();
    if (!drive) {
      throw new Error('Google Drive is not configured');
    }

    const [metadataRes, streamRes] = await Promise.all([
      drive.files.get({
        fileId,
        fields: 'id, name, mimeType, size',
      }),
      drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
      ),
    ]);

    return {
      stream: streamRes.data,
      metadata: metadataRes.data,
      mimeType: metadataRes.data.mimeType || 'image/jpeg',
      size: metadataRes.data.size,
      name: metadataRes.data.name,
    };
  }

  async getFileMetadata(fileId) {
    const drive = this.initialize();
    if (!drive) return null;

    const res = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, size, createdTime',
    });
    return res.data;
  }

  async getStorageQuota() {
    const drive = this.initialize();
    if (!drive) return null;

    try {
      const res = await drive.about.get({
        fields: 'storageQuota, user',
      });
      return {
        storageQuota: res.data.storageQuota,
        user: res.data.user,
      };
    } catch (err) {
      console.warn('Failed to retrieve storage quota:', err.message);
      return null;
    }
  }
}

export const googleDriveService = new GoogleDriveService();
export default googleDriveService;
