import multer from 'multer';

// Use memory storage so image binaries are streamed directly to Drive without permanent disk storage
const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB max per image

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    const error = new Error(
      `Unsupported file type: ${file.mimetype}. Only JPG, JPEG, PNG, and WEBP images are supported.`
    );
    error.statusCode = 400;
    cb(error, false);
  }
};

export const uploadSingleImage = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
}).single('image');

export const uploadMultipleImages = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: 100 },
  fileFilter,
}).array('pages', 100);

export default {
  uploadSingleImage,
  uploadMultipleImages,
};
