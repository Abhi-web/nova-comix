import Manga from '../models/Manga.js';
import Chapter from '../models/Chapter.js';
import googleDriveService from '../services/googleDriveService.js';
import storageService from '../services/storageService.js';

/**
 * Controller handling real Google Drive uploads, page reordering,
 * replacement, publish validation, and safe cleanup.
 */

// Helper to sanitize extensions
function getSafeExtension(mimeType) {
  switch (mimeType) {
    case 'image/png':
      return 'png';
    case 'image/webp':
      return 'webp';
    case 'image/jpeg':
    case 'image/jpg':
    default:
      return 'jpg';
  }
}

/**
 * Upload Manga Cover to Google Drive
 */
export async function uploadMangaCover(req, res, next) {
  try {
    const { mangaId } = req.params;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const manga = await Manga.findById(mangaId);
    if (!manga) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    if (!googleDriveService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Google Drive storage is not configured. Please complete setup in backend/.env',
      });
    }

    const { coverFolderId } = await googleDriveService.ensureMangaFolder(manga.slug);
    const ext = getSafeExtension(req.file.mimetype);
    const fileName = `cover-${Date.now()}.${ext}`;

    const oldCoverFileId = manga.coverFileId;

    // Upload new file first
    const uploaded = await googleDriveService.uploadFile({
      fileBuffer: req.file.buffer,
      fileName,
      mimeType: req.file.mimetype,
      parentFolderId: coverFolderId,
    });

    // Update MongoDB
    manga.coverFileId = uploaded.fileId;
    manga.coverImage = storageService.getFileAccessUrl(uploaded.fileId);
    await manga.save();

    // Safely delete old cover from Google Drive
    if (oldCoverFileId && oldCoverFileId !== uploaded.fileId) {
      try {
        await googleDriveService.deleteFile(oldCoverFileId);
      } catch (delErr) {
        console.warn('Failed to delete old cover file:', delErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Cover uploaded successfully',
      data: {
        coverImage: manga.coverImage,
        coverFileId: manga.coverFileId,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Upload Manga Banner to Google Drive
 */
export async function uploadMangaBanner(req, res, next) {
  try {
    const { mangaId } = req.params;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const manga = await Manga.findById(mangaId);
    if (!manga) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    if (!googleDriveService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Google Drive storage is not configured. Please complete setup in backend/.env',
      });
    }

    const { bannerFolderId } = await googleDriveService.ensureMangaFolder(manga.slug);
    const ext = getSafeExtension(req.file.mimetype);
    const fileName = `banner-${Date.now()}.${ext}`;

    const oldBannerFileId = manga.bannerFileId;

    // Upload new file first
    const uploaded = await googleDriveService.uploadFile({
      fileBuffer: req.file.buffer,
      fileName,
      mimeType: req.file.mimetype,
      parentFolderId: bannerFolderId,
    });

    // Update MongoDB
    manga.bannerFileId = uploaded.fileId;
    manga.bannerImage = storageService.getFileAccessUrl(uploaded.fileId);
    await manga.save();

    // Safely delete old banner from Google Drive
    if (oldBannerFileId && oldBannerFileId !== uploaded.fileId) {
      try {
        await googleDriveService.deleteFile(oldBannerFileId);
      } catch (delErr) {
        console.warn('Failed to delete old banner file:', delErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Banner uploaded successfully',
      data: {
        bannerImage: manga.bannerImage,
        bannerFileId: manga.bannerFileId,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Upload Chapter Pages to Google Drive
 */
export async function uploadChapterPages(req, res, next) {
  try {
    const { chapterId } = req.params;
    const files = req.files || (req.file ? [req.file] : []);

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No pages provided for upload' });
    }

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    const manga = await Manga.findById(chapter.mangaId);
    if (!manga) {
      return res.status(404).json({ success: false, message: 'Associated story not found' });
    }

    if (!googleDriveService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Google Drive storage is not configured. Please complete setup in backend/.env',
      });
    }

    // Ensure chapter folder in Drive (reuse driveFolderId if already stored to avoid slow folder lookups)
    let chapterFolderId = chapter.driveFolderId;
    if (!chapterFolderId) {
      chapterFolderId = await googleDriveService.ensureChapterFolder(manga.slug, chapter.number);
      await Chapter.findByIdAndUpdate(chapterId, { driveFolderId: chapterFolderId });
    }

    const uploadedPages = [];
    const failedPages = [];

    // Controlled concurrency upload (max 3 at a time)
    const concurrency = parseInt(process.env.MAX_CONCURRENT_UPLOADS, 10) || 3;
    const queue = [...files];

    async function worker() {
      while (queue.length > 0) {
        const file = queue.shift();
        const ext = getSafeExtension(file.mimetype);
        const tempFileName = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

        try {
          const uploaded = await googleDriveService.uploadFile({
            fileBuffer: file.buffer,
            fileName: tempFileName,
            mimeType: file.mimetype,
            parentFolderId: chapterFolderId,
          });

          uploadedPages.push({
            fileId: uploaded.fileId,
            imageUrl: storageService.getFileAccessUrl(uploaded.fileId),
            originalName: file.originalname || tempFileName,
            mimeType: uploaded.mimeType,
            fileSize: uploaded.size,
            createdAt: new Date(),
          });
        } catch (uploadErr) {
          console.error(`Google Drive upload error for ${file.originalname}:`, uploadErr.message);
          failedPages.push({
            originalName: file.originalname,
            error: uploadErr.message,
          });
        }
      }
    }

    const workers = Array.from({ length: Math.min(concurrency, files.length) }, () => worker());
    await Promise.all(workers);

    // If all files in this batch failed, return explicit error status
    if (uploadedPages.length === 0 && failedPages.length > 0) {
      return res.status(500).json({
        success: false,
        message: failedPages[0]?.error || 'Failed to upload page(s) to Google Drive',
        data: {
          totalUploaded: 0,
          totalFailed: failedPages.length,
          failed: failedPages,
        },
      });
    }

    // Safely append to Chapter with retry to eliminate any Mongoose VersionError race conditions
    let savedChapter = null;
    let attempts = 0;
    const MAX_SAVE_ATTEMPTS = 3;

    while (attempts < MAX_SAVE_ATTEMPTS) {
      attempts++;
      try {
        const freshDoc = await Chapter.findById(chapterId);
        if (!freshDoc) {
          return res.status(404).json({ success: false, message: 'Chapter not found' });
        }

        // Determine current max page number dynamically
        let currentMax = 0;
        (freshDoc.pages || []).forEach((p) => {
          if (p && typeof p.pageNumber === 'number' && p.pageNumber > currentMax) {
            currentMax = p.pageNumber;
          }
        });

        // Assign clean sequential page numbers to newly uploaded pages
        const pagesToAdd = uploadedPages.map((up, idx) => ({
          ...up,
          pageNumber: currentMax + idx + 1,
        }));

        freshDoc.pages.push(...pagesToAdd);
        freshDoc.pages.sort((a, b) => a.pageNumber - b.pageNumber);
        if (!freshDoc.driveFolderId) {
          freshDoc.driveFolderId = chapterFolderId;
        }

        savedChapter = await freshDoc.save();
        break; // Successfully saved
      } catch (saveErr) {
        if (saveErr.name === 'VersionError' && attempts < MAX_SAVE_ATTEMPTS) {
          await new Promise((r) => setTimeout(r, 100 * attempts));
        } else {
          throw saveErr;
        }
      }
    }

    const currentPages = savedChapter ? savedChapter.pages : chapter.pages;

    res.status(200).json({
      success: true,
      data: {
        pages: currentPages,
        totalUploaded: uploadedPages.length,
        totalFailed: failedPages.length,
        failed: failedPages,
      },
      message:
        failedPages.length > 0
          ? `${uploadedPages.length} of ${files.length} uploaded — ${failedPages.length} failed`
          : `${uploadedPages.length} pages uploaded successfully`,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Reorder Chapter Pages
 */
export async function reorderChapterPages(req, res, next) {
  try {
    const { chapterId } = req.params;
    const { pageOrders } = req.body; // Array of { pageId or fileId, pageNumber }

    if (!Array.isArray(pageOrders)) {
      return res.status(400).json({
        success: false,
        message: 'pageOrders must be an array of { pageId/fileId, pageNumber }',
      });
    }

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    const orderMap = new Map();
    pageOrders.forEach((item) => {
      const key = item.pageId || item.fileId || item._id;
      if (key && typeof item.pageNumber === 'number') {
        orderMap.set(key.toString(), item.pageNumber);
      }
    });

    chapter.pages.forEach((page) => {
      const pageIdStr = page._id ? page._id.toString() : '';
      const fileIdStr = page.fileId ? page.fileId.toString() : '';

      if (orderMap.has(pageIdStr)) {
        page.pageNumber = orderMap.get(pageIdStr);
      } else if (orderMap.has(fileIdStr)) {
        page.pageNumber = orderMap.get(fileIdStr);
      }
    });

    // Sort numerically by pageNumber
    chapter.pages.sort((a, b) => a.pageNumber - b.pageNumber);
    await chapter.save();

    res.status(200).json({
      success: true,
      message: 'Pages reordered successfully',
      data: chapter.pages,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Replace a Single Chapter Page (Upload First -> Delete Old)
 */
export async function replaceChapterPage(req, res, next) {
  try {
    const { chapterId, pageId } = req.params;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'New replacement page file required' });
    }

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    const manga = await Manga.findById(chapter.mangaId);
    if (!manga) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    const pageIndex = chapter.pages.findIndex(
      (p) => p._id?.toString() === pageId || p.fileId === pageId
    );

    if (pageIndex === -1) {
      return res.status(404).json({ success: false, message: 'Target page not found in chapter' });
    }

    const targetPage = chapter.pages[pageIndex];
    const oldFileId = targetPage.fileId;

    const chapterFolderId =
      chapter.driveFolderId ||
      (await googleDriveService.ensureChapterFolder(manga.slug, chapter.number));

    const ext = getSafeExtension(req.file.mimetype);
    const fileName = `page-${String(targetPage.pageNumber).padStart(3, '0')}-r${Date.now()}.${ext}`;

    // 1. Upload new file first
    const uploaded = await googleDriveService.uploadFile({
      fileBuffer: req.file.buffer,
      fileName,
      mimeType: req.file.mimetype,
      parentFolderId: chapterFolderId,
    });

    // 2. Update page metadata in MongoDB
    targetPage.fileId = uploaded.fileId;
    targetPage.imageUrl = storageService.getFileAccessUrl(uploaded.fileId);
    targetPage.mimeType = uploaded.mimeType;
    targetPage.fileSize = uploaded.size;
    targetPage.createdAt = new Date();

    await chapter.save();

    // 3. Delete old file from Google Drive safely
    if (oldFileId && oldFileId !== uploaded.fileId) {
      try {
        await googleDriveService.deleteFile(oldFileId);
      } catch (err) {
        console.warn(`Failed to delete old page file ${oldFileId}:`, err.message);
      }
    }

    res.status(200).json({
      success: true,
      message: `Page ${targetPage.pageNumber} replaced successfully`,
      data: targetPage,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a Single Chapter Page
 */
export async function deleteChapterPage(req, res, next) {
  try {
    const { chapterId, pageId } = req.params;

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    const pageIndex = chapter.pages.findIndex(
      (p) => p._id?.toString() === pageId || p.fileId === pageId
    );

    if (pageIndex === -1) {
      return res.status(404).json({ success: false, message: 'Page not found in chapter' });
    }

    const pageToDelete = chapter.pages[pageIndex];
    const fileId = pageToDelete.fileId;

    // Delete from Google Drive
    if (fileId) {
      try {
        await googleDriveService.deleteFile(fileId);
      } catch (err) {
        console.warn('Drive deletion warning on page delete:', err.message);
      }
    }

    // Remove from chapter pages
    chapter.pages.splice(pageIndex, 1);

    // Re-sequence page numbers so they remain clean & contiguous
    chapter.pages.forEach((p, idx) => {
      p.pageNumber = idx + 1;
    });

    await chapter.save();

    res.status(200).json({
      success: true,
      message: 'Page deleted successfully',
      data: chapter.pages,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Publish Chapter with Strict Validation (Requirement 17)
 */
export async function publishChapter(req, res, next) {
  try {
    const { chapterId } = req.params;

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    const manga = await Manga.findById(chapter.mangaId);
    if (!manga) {
      return res.status(404).json({ success: false, message: 'Associated story not found' });
    }

    // Validation Checks:
    // 1. Chapter number valid
    if (chapter.number === undefined || chapter.number === null || isNaN(chapter.number) || chapter.number < 0) {
      return res.status(400).json({ success: false, message: 'Invalid chapter number' });
    }

    // 2. At least one page exists
    if (!chapter.pages || chapter.pages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot publish chapter with 0 pages. Upload at least one page before publishing.',
      });
    }

    // 3. All pages have fileId
    const missingFileId = chapter.pages.some((p) => !p.fileId);
    if (missingFileId) {
      return res.status(400).json({
        success: false,
        message: 'One or more pages have missing file storage references. Please re-upload.',
      });
    }

    // 4. Page numbers unique
    const pageNumbers = chapter.pages.map((p) => p.pageNumber);
    const uniquePageNumbers = new Set(pageNumbers);
    if (uniquePageNumbers.size !== pageNumbers.length) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate page numbers detected. Please reorder pages before publishing.',
      });
    }

    // 5. Page numbers sorted sequentially
    chapter.pages.sort((a, b) => a.pageNumber - b.pageNumber);

    chapter.status = 'published';
    chapter.publishedAt = new Date();
    await chapter.save();

    // Update Manga updatedAt
    await Manga.findByIdAndUpdate(manga._id, { updatedAt: new Date() });

    res.status(200).json({
      success: true,
      message: `Chapter ${chapter.number} is now published and publicly visible.`,
      data: chapter,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Unpublish Chapter (Sets to Draft)
 */
export async function unpublishChapter(req, res, next) {
  try {
    const { chapterId } = req.params;

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    chapter.status = 'draft';
    await chapter.save();

    res.status(200).json({
      success: true,
      message: `Chapter ${chapter.number} is now saved as a draft.`,
      data: chapter,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete Chapter with Google Drive Cleanup (Requirement 26)
 */
export async function deleteChapterWithDriveCleanup(req, res, next) {
  try {
    const { chapterId } = req.params;

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ success: false, message: 'Chapter not found' });
    }

    const mangaId = chapter.mangaId;

    // Delete associated pages from Google Drive
    if (Array.isArray(chapter.pages)) {
      for (const page of chapter.pages) {
        if (page.fileId) {
          try {
            await googleDriveService.deleteFile(page.fileId);
          } catch (delErr) {
            console.warn(`Failed to delete page file ${page.fileId}:`, delErr.message);
          }
        }
      }
    }

    // Delete chapter folder from Drive if driveFolderId is stored
    if (chapter.driveFolderId) {
      try {
        await googleDriveService.deleteFile(chapter.driveFolderId);
      } catch (delErr) {
        console.warn(`Failed to delete chapter folder ${chapter.driveFolderId}:`, delErr.message);
      }
    }

    // Delete chapter document from MongoDB
    await Chapter.findByIdAndDelete(chapterId);

    // Update manga updatedAt
    await Manga.findByIdAndUpdate(mangaId, { updatedAt: new Date() });

    res.status(200).json({
      success: true,
      message: 'Chapter and associated Google Drive files cleaned up successfully',
    });
  } catch (error) {
    next(error);
  }
}
