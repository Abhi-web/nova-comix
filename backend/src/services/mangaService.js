import mongoose from 'mongoose';
import Manga from '../models/Manga.js';
import Chapter from '../models/Chapter.js';
import { slugify } from '../utils/slugify.js';

export async function getAllManga(queryParams) {
  const {
    page = 1,
    limit = 20,
    search = '',
    type = '',
    genre = '',
    status = '',
    sort = 'newest',
    featured,
  } = queryParams;

  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (parsedPage - 1) * parsedLimit;

  // Build filter query
  const filter = {};

  if (type) {
    filter.type = type.toLowerCase();
  }

  if (status) {
    filter.status = status.toLowerCase();
  }

  if (genre) {
    // Case-insensitive match in genres array
    filter.genres = { $regex: new RegExp(`^${genre.trim()}$`, 'i') };
  }

  if (featured !== undefined) {
    filter.featured = featured === 'true' || featured === true;
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { title: searchRegex },
      { alternativeTitles: searchRegex },
      { author: searchRegex },
      { artist: searchRegex },
      { genres: searchRegex },
    ];
  }

  // Sorting
  let sortCriteria = { createdAt: -1 };
  switch (sort) {
    case 'newest':
      sortCriteria = { createdAt: -1 };
      break;
    case 'oldest':
      sortCriteria = { createdAt: 1 };
      break;
    case 'popular':
    case 'views':
      sortCriteria = { views: -1, createdAt: -1 };
      break;
    case 'rating':
      sortCriteria = { rating: -1, createdAt: -1 };
      break;
    case 'title':
      sortCriteria = { title: 1 };
      break;
    case 'updated':
      sortCriteria = { updatedAt: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
  }

  const [total, items] = await Promise.all([
    Manga.countDocuments(filter),
    Manga.find(filter).sort(sortCriteria).skip(skip).limit(parsedLimit).lean(),
  ]);

  // Optionally attach chapter counts for each manga efficiently
  const mangaIds = items.map((m) => m._id);
  const chapterCounts = await Chapter.aggregate([
    { $match: { mangaId: { $in: mangaIds } } },
    { $group: { _id: '$mangaId', count: { $sum: 1 } } },
  ]);

  const countMap = {};
  chapterCounts.forEach((c) => {
    countMap[c._id.toString()] = c.count;
  });

  const mangaWithCounts = items.map((item) => ({
    ...item,
    chaptersCount: countMap[item._id.toString()] || 0,
  }));

  return {
    items: mangaWithCounts,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
}

export async function getMangaByIdOrSlug(identifier) {
  let query;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    query = { _id: identifier };
  } else {
    query = { slug: identifier.toLowerCase() };
  }

  const manga = await Manga.findOne(query).lean();
  if (!manga) {
    const error = new Error('Story not found');
    error.statusCode = 404;
    throw error;
  }

  // Count chapters
  const chaptersCount = await Chapter.countDocuments({ mangaId: manga._id });

  return {
    ...manga,
    chaptersCount,
  };
}

export async function createManga(data) {
  const {
    title,
    alternativeTitles,
    slug: customSlug,
    description,
    coverImage,
    bannerImage,
    type,
    status = 'ongoing',
    author,
    artist,
    genres,
    rating = 0,
    views = 0,
    featured = false,
  } = data;

  if (!title) {
    const error = new Error('Title is required');
    error.statusCode = 400;
    throw error;
  }

  if (!type) {
    const error = new Error('Type is required');
    error.statusCode = 400;
    throw error;
  }

  // Validate type enum
  const validTypes = ['manga', 'manhwa', 'manhua', 'webtoon'];
  if (!validTypes.includes(type.toLowerCase())) {
    const error = new Error(`Type must be one of: ${validTypes.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  // Validate status enum
  const validStatuses = ['ongoing', 'completed', 'hiatus'];
  if (status && !validStatuses.includes(status.toLowerCase())) {
    const error = new Error(`Status must be one of: ${validStatuses.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  // Validate rating range
  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 0 || numRating > 10) {
    const error = new Error('Rating must be a number between 0 and 10');
    error.statusCode = 400;
    throw error;
  }

  let finalSlug = slugify(customSlug || title);
  if (!finalSlug) {
    finalSlug = `story-${Date.now()}`;
  }

  // Ensure unique slug
  let slugExists = await Manga.findOne({ slug: finalSlug });
  let counter = 1;
  while (slugExists) {
    finalSlug = `${slugify(customSlug || title)}-${counter}`;
    slugExists = await Manga.findOne({ slug: finalSlug });
    counter++;
  }

  // Process genres and alternativeTitles
  const parsedGenres = Array.isArray(genres)
    ? genres.map((g) => g.trim()).filter(Boolean)
    : typeof genres === 'string'
      ? genres.split(',').map((g) => g.trim()).filter(Boolean)
      : [];

  const parsedAltTitles = Array.isArray(alternativeTitles)
    ? alternativeTitles.map((t) => t.trim()).filter(Boolean)
    : typeof alternativeTitles === 'string'
      ? alternativeTitles.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

  const manga = new Manga({
    title: title.trim(),
    alternativeTitles: parsedAltTitles,
    slug: finalSlug,
    description: description ? description.trim() : '',
    coverImage: coverImage ? coverImage.trim() : '',
    bannerImage: bannerImage ? bannerImage.trim() : '',
    type: type.toLowerCase(),
    status: status ? status.toLowerCase() : 'ongoing',
    author: author ? author.trim() : '',
    artist: artist ? artist.trim() : '',
    genres: parsedGenres,
    rating: numRating,
    views: Number(views) || 0,
    featured: Boolean(featured),
  });

  await manga.save();
  return manga;
}

export async function updateManga(id, data) {
  const manga = await Manga.findById(id);
  if (!manga) {
    const error = new Error('Story not found');
    error.statusCode = 404;
    throw error;
  }

  // Validate fields if provided
  if (data.type) {
    const validTypes = ['manga', 'manhwa', 'manhua', 'webtoon'];
    if (!validTypes.includes(data.type.toLowerCase())) {
      const error = new Error(`Type must be one of: ${validTypes.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }
    manga.type = data.type.toLowerCase();
  }

  if (data.status) {
    const validStatuses = ['ongoing', 'completed', 'hiatus'];
    if (!validStatuses.includes(data.status.toLowerCase())) {
      const error = new Error(`Status must be one of: ${validStatuses.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }
    manga.status = data.status.toLowerCase();
  }

  if (data.rating !== undefined) {
    const numRating = Number(data.rating);
    if (isNaN(numRating) || numRating < 0 || numRating > 10) {
      const error = new Error('Rating must be a number between 0 and 10');
      error.statusCode = 400;
      throw error;
    }
    manga.rating = numRating;
  }

  if (data.title !== undefined) manga.title = data.title.trim();
  if (data.description !== undefined) manga.description = data.description.trim();
  if (data.coverImage !== undefined) manga.coverImage = data.coverImage.trim();
  if (data.bannerImage !== undefined) manga.bannerImage = data.bannerImage.trim();
  if (data.author !== undefined) manga.author = data.author.trim();
  if (data.artist !== undefined) manga.artist = data.artist.trim();
  if (data.views !== undefined) manga.views = Number(data.views) || 0;
  if (data.featured !== undefined) manga.featured = Boolean(data.featured);

  if (data.genres !== undefined) {
    manga.genres = Array.isArray(data.genres)
      ? data.genres.map((g) => g.trim()).filter(Boolean)
      : typeof data.genres === 'string'
        ? data.genres.split(',').map((g) => g.trim()).filter(Boolean)
        : [];
  }

  if (data.alternativeTitles !== undefined) {
    manga.alternativeTitles = Array.isArray(data.alternativeTitles)
      ? data.alternativeTitles.map((t) => t.trim()).filter(Boolean)
      : typeof data.alternativeTitles === 'string'
        ? data.alternativeTitles.split(',').map((t) => t.trim()).filter(Boolean)
        : [];
  }

  if (data.slug && data.slug.trim()) {
    const newSlug = slugify(data.slug);
    if (newSlug !== manga.slug) {
      const existing = await Manga.findOne({ slug: newSlug, _id: { $ne: manga._id } });
      if (existing) {
        const error = new Error('Slug is already in use by another story');
        error.statusCode = 409;
        throw error;
      }
      manga.slug = newSlug;
    }
  }

  await manga.save();
  return manga;
}

export async function deleteManga(id) {
  const manga = await Manga.findById(id);
  if (!manga) {
    const error = new Error('Story not found');
    error.statusCode = 404;
    throw error;
  }

  // Cascade delete all chapters
  await Chapter.deleteMany({ mangaId: manga._id });
  await Manga.findByIdAndDelete(manga._id);

  return { message: 'Story and its chapters deleted successfully' };
}

export async function getDashboardStats() {
  const [totalStories, totalChapters, publishedStories, draftChapters] = await Promise.all([
    Manga.countDocuments(),
    Chapter.countDocuments(),
    Manga.countDocuments({ status: { $in: ['ongoing', 'completed'] } }),
    Chapter.countDocuments({ status: 'draft' }),
  ]);

  const recentStories = await Manga.find().sort({ createdAt: -1 }).limit(5).lean();

  const recentChapters = await Chapter.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('mangaId', 'title slug coverImage')
    .lean();

  return {
    totalStories,
    totalChapters,
    publishedStories,
    draftChapters,
    recentStories,
    recentChapters,
  };
}
