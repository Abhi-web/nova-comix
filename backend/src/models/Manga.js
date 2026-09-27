import mongoose from 'mongoose';

const mangaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    alternativeTitles: {
      type: [String],
      default: [],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    coverFileId: {
      type: String,
      default: '',
    },
    bannerImage: {
      type: String,
      default: '',
    },
    bannerFileId: {
      type: String,
      default: '',
    },
    driveFolderId: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: {
        values: ['manga', 'manhwa', 'manhua', 'webtoon'],
        message: '{VALUE} is not a valid manga type',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['ongoing', 'completed', 'hiatus'],
        message: '{VALUE} is not a valid status',
      },
      default: 'ongoing',
    },
    author: {
      type: String,
      default: '',
      trim: true,
    },
    artist: {
      type: String,
      default: '',
      trim: true,
    },
    genres: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [10, 'Rating cannot exceed 10'],
    },
    views: {
      type: Number,
      default: 0,
      min: [0, 'Views cannot be negative'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
mangaSchema.index({ title: 1 });
mangaSchema.index({ type: 1 });
mangaSchema.index({ status: 1 });
mangaSchema.index({ genres: 1 });
mangaSchema.index({ featured: 1 });
mangaSchema.index({ views: -1 });
mangaSchema.index({ rating: -1 });

// Text index for robust search
mangaSchema.index({
  title: 'text',
  alternativeTitles: 'text',
  author: 'text',
  artist: 'text',
  genres: 'text',
});

const Manga = mongoose.model('Manga', mangaSchema);

export default Manga;
