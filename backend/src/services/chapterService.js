import mongoose from 'mongoose';
import Chapter from '../models/Chapter.js';
import Manga from '../models/Manga.js';
import googleDriveService from './googleDriveService.js';

/**
 * Helper to resolve mangaId whether given as ObjectId or slug
 */
async function resolveMangaId(mangaIdentifier) {
  if (mongoose.Types.ObjectId.isValid(mangaIdentifier)) {
    return mangaIdentifier;
  }
  const manga = await Manga.findOne({ slug: mangaIdentifier.toLowerCase() }).select('_id');
  if (!manga) {
    const error = new Error('Story not found');
    error.statusCode = 404;
    throw error;
  }
  return manga._id;
}

export async function getChaptersByManga(mangaIdentifier, queryParams = {}) {
  const mangaId = await resolveMangaId(mangaIdentifier);
  const { page = 1, limit = 50, sort = 'newest', status = 'published' } = queryParams;

  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));
  const skip = (parsedPage - 1) * parsedLimit;

  const filter = { mangaId };
  // If status === 'all', do not filter by status (used by admin console)
  if (status && status !== 'all') {
    filter.status = status;
  }

  const sortOrder = sort === 'oldest' ? 1 : -1;
  const sortCriteria = { number: sortOrder };

  const [total, chapters] = await Promise.all([
    Chapter.countDocuments(filter),
    Chapter.find(filter).sort(sortCriteria).skip(skip).limit(parsedLimit).lean(),
  ]);

  return {
    items: chapters,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
}

export async function getChapterById(chapterId, options = {}) {
  const chapter = await Chapter.findById(chapterId)
    .populate('mangaId', 'title slug coverImage type author')
    .lean();
  if (!chapter) {
    const error = new Error('Chapter not found');
    error.statusCode = 404;
    throw error;
  }

  const isPublic = options.isPublic ?? true;
  if (isPublic && chapter.status !== 'published') {
    const error = new Error('Chapter not found or not currently published');
    error.statusCode = 404;
    throw error;
  }

  // Ensure pages are sorted numerically by pageNumber
  if (Array.isArray(chapter.pages)) {
    chapter.pages.sort((a, b) => (a.pageNumber || 0) - (b.pageNumber || 0));
  }

  // Find previous and next chapters for seamless reader navigation
  const parentMangaId = chapter.mangaId?._id || chapter.mangaId;

  const surroundingFilter = { mangaId: parentMangaId };
  if (isPublic) {
    surroundingFilter.status = 'published';
  }

  const [prev, next] = await Promise.all([
    Chapter.findOne({
      ...surroundingFilter,
      number: { $lt: chapter.number },
    })
      .sort({ number: -1 })
      .select('_id number title slug')
      .lean(),
    Chapter.findOne({
      ...surroundingFilter,
      number: { $gt: chapter.number },
    })
      .sort({ number: 1 })
      .select('_id number title slug')
      .lean(),
  ]);

  return {
    ...chapter,
    prevChapter: prev,
    nextChapter: next,
  };
}


export async function createChapter(mangaIdentifier, data) {
  const mangaId = await resolveMangaId(mangaIdentifier);

  const { number, title = '', status = 'published', publishedAt } = data;

  if (number === undefined || number === null || number === '') {
    const error = new Error('Chapter number is required');
    error.statusCode = 400;
    throw error;
  }

  const numNumber = Number(number);
  if (isNaN(numNumber) || numNumber < 0) {
    const error = new Error('Chapter number must be a non-negative number');
    error.statusCode = 400;
    throw error;
  }

  // Check if chapter number already exists for this manga
  const existing = await Chapter.findOne({ mangaId, number: numNumber });
  if (existing) {
    const error = new Error(`Chapter ${numNumber} already exists for this story`);
    error.statusCode = 409;
    throw error;
  }

  const chapter = new Chapter({
    mangaId,
    number: numNumber,
    title: title ? title.trim() : '',
    slug: `chapter-${numNumber}`,
    status: status === 'draft' ? 'draft' : 'published',
    publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    pages: [], // As required for Step 5, pages remain empty
  });

  await chapter.save();

  // Update Manga's updatedAt
  await Manga.findByIdAndUpdate(mangaId, { updatedAt: new Date() });

  return chapter;
}

export async function updateChapter(chapterId, data) {
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) {
    const error = new Error('Chapter not found');
    error.statusCode = 404;
    throw error;
  }

  if (data.number !== undefined) {
    const numNumber = Number(data.number);
    if (isNaN(numNumber) || numNumber < 0) {
      const error = new Error('Chapter number must be a non-negative number');
      error.statusCode = 400;
      throw error;
    }

    if (numNumber !== chapter.number) {
      const existing = await Chapter.findOne({
        mangaId: chapter.mangaId,
        number: numNumber,
        _id: { $ne: chapter._id },
      });
      if (existing) {
        const error = new Error(`Chapter ${numNumber} already exists for this story`);
        error.statusCode = 409;
        throw error;
      }
      chapter.number = numNumber;
      chapter.slug = `chapter-${numNumber}`;
    }
  }

  if (data.title !== undefined) {
    chapter.title = data.title.trim();
  }

  if (data.status !== undefined) {
    if (!['draft', 'published'].includes(data.status)) {
      const error = new Error('Status must be either "draft" or "published"');
      error.statusCode = 400;
      throw error;
    }
    chapter.status = data.status;
  }

  if (data.publishedAt !== undefined) {
    chapter.publishedAt = new Date(data.publishedAt);
  }

  await chapter.save();

  // Update Manga's updatedAt
  await Manga.findByIdAndUpdate(chapter.mangaId, { updatedAt: new Date() });

  return chapter;
}

export async function deleteChapter(chapterId) {
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) {
    const error = new Error('Chapter not found');
    error.statusCode = 404;
    throw error;
  }

  const mangaId = chapter.mangaId;

  // Cleanup Google Drive files if any exist
  if (Array.isArray(chapter.pages)) {
    for (const page of chapter.pages) {
      if (page.fileId) {
        try {
          await googleDriveService.deleteFile(page.fileId);
        } catch (delErr) {
          console.warn(`Drive cleanup warning on page ${page.fileId}:`, delErr.message);
        }
      }
    }
  }

  if (chapter.driveFolderId) {
    try {
      await googleDriveService.deleteFile(chapter.driveFolderId);
    } catch (delErr) {
      console.warn(`Drive cleanup warning on chapter folder ${chapter.driveFolderId}:`, delErr.message);
    }
  }

  await Chapter.findByIdAndDelete(chapterId);

  // Update Manga updatedAt
  await Manga.findByIdAndUpdate(mangaId, { updatedAt: new Date() });

  return { message: 'Chapter and associated files deleted successfully' };
}
