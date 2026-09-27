import express from 'express';
import {
  getStorageStatus,
  getAuthUrl,
  handleOAuthCallback,
  streamReaderPage,
} from '../controllers/storageController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Storage Status (Admin or system health check)
router.get('/status', getStorageStatus);

// Generate OAuth 2.0 URL for Admin to link Google Drive
router.get('/auth-url', authMiddleware, adminMiddleware, getAuthUrl);

// Public OAuth2 callback from Google
router.get('/oauth2callback', handleOAuthCallback);

// Controlled image stream access for Reader (Requirement 19)
router.get('/reader/pages/:fileId', streamReaderPage);

export default router;
