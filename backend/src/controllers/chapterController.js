import {
  getChaptersByManga,
  getChapterById,
  createChapter,
  updateChapter,
  deleteChapter,
} from '../services/chapterService.js';

export async function getChapters(req, res, next) {
  try {
    const isPublic = req.user?.role !== 'admin';
    const query = { ...req.query };
    if (isPublic) {
      query.status = 'published';
    }
    const result = await getChaptersByManga(req.params.mangaId, query);
    res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
}

export async function getChapter(req, res, next) {
  try {
    const isPublic = req.user?.role !== 'admin';
    const chapter = await getChapterById(req.params.id, { isPublic });
    res.status(200).json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
}

export async function create(req, res, next) {
  try {
    const chapter = await createChapter(req.params.mangaId, req.body);
    res.status(201).json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
}

export async function update(req, res, next) {
  try {
    const chapter = await updateChapter(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: chapter,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
}

export async function remove(req, res, next) {
  try {
    const result = await deleteChapter(req.params.id);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      next(error);
    }
  }
}
