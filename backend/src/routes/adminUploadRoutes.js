import express from 'express';
import {
  uploadMangaCover,
  uploadMangaBanner,
  uploadChapterPages,
  reorderChapterPages,
  replaceChapterPage,
  deleteChapterPage,
  publishChapter,
  unpublishChapter,
  deleteChapterWithDriveCleanup,
} from '../controllers/adminUploadController.js';
import { create as createChapter, update as updateChapter } from '../controllers/chapterController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import { uploadSingleImage, uploadMultipleImages } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All routes require valid admin authentication
router.use(authMiddleware, adminMiddleware);

// Manga Media Uploads
router.post('/manga/:mangaId/cover', uploadSingleImage, uploadMangaCover);
router.post('/manga/:mangaId/banner', uploadSingleImage, uploadMangaBanner);

// Chapter Creation & Info Updates (Requirement 22)
router.post('/manga/:mangaId/chapters', createChapter);
router.put('/chapters/:chapterId', updateChapter);

// Chapter Pages Upload & Management
router.post('/chapters/:chapterId/pages', uploadMultipleImages, uploadChapterPages);
router.put('/chapters/:chapterId/reorder-pages', reorderChapterPages);
router.put('/chapters/:chapterId/replace-page/:pageId', uploadSingleImage, replaceChapterPage);
router.delete('/chapters/:chapterId/pages/:pageId', deleteChapterPage);

// Chapter Publish / Unpublish / Cleanup Deletion
router.put('/chapters/:chapterId/publish', publishChapter);
router.put('/chapters/:chapterId/unpublish', unpublishChapter);
router.delete('/chapters/:chapterId', deleteChapterWithDriveCleanup);

export default router;
