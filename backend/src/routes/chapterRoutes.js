import express from 'express';
import {
  getChapter,
  update,
  remove,
} from '../controllers/chapterController.js';
import { authMiddleware, adminMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public / Reader: GET /api/chapters/:id (supports admin preview of drafts)
router.get('/:id', optionalAuthMiddleware, getChapter);

// Admin: PUT /api/chapters/:id
router.put('/:id', authMiddleware, adminMiddleware, update);

// Admin: DELETE /api/chapters/:id
router.delete('/:id', authMiddleware, adminMiddleware, remove);

export default router;
