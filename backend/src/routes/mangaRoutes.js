import express from 'express';
import {
  getMangaList,
  getManga,
  create,
  update,
  remove,
  getStats,
} from '../controllers/mangaController.js';
import {
  getChapters,
  create as createChapterForManga,
} from '../controllers/chapterController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getMangaList);

// Admin dashboard statistics (must be placed before /:id)
router.get('/stats/dashboard', authMiddleware, adminMiddleware, getStats);

router.get('/:id', getManga);

// Admin manga management routes
router.post('/', authMiddleware, adminMiddleware, create);
router.put('/:id', authMiddleware, adminMiddleware, update);
router.delete('/:id', authMiddleware, adminMiddleware, remove);

// Nested chapter routes for a manga:
// GET /api/manga/:mangaId/chapters (public)
// POST /api/manga/:mangaId/chapters (admin)
router.get('/:mangaId/chapters', getChapters);
router.post('/:mangaId/chapters', authMiddleware, adminMiddleware, createChapterForManga);

export default router;
