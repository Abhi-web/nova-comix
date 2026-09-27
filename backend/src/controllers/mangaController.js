import {
  getAllManga,
  getMangaByIdOrSlug,
  createManga,
  updateManga,
  deleteManga,
  getDashboardStats,
} from '../services/mangaService.js';

export async function getMangaList(req, res, next) {
  try {
    const result = await getAllManga(req.query);
    res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getManga(req, res, next) {
  try {
    const manga = await getMangaByIdOrSlug(req.params.id);
    res.status(200).json({
      success: true,
      data: manga,
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
    const manga = await createManga(req.body);
    res.status(201).json({
      success: true,
      data: manga,
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
    const manga = await updateManga(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: manga,
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
    const result = await deleteManga(req.params.id);
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

export async function getStats(req, res, next) {
  try {
    const stats = await getDashboardStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}
