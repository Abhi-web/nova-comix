import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema(
  {
    mangaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Manga',
      required: [true, 'mangaId is required'],
      index: true,
    },
    number: {
      type: Number,
      required: [true, 'Chapter number is required'],
      min: [0, 'Chapter number must be non-negative'],
    },
    title: {
      type: String,
      default: '',
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published'],
        message: '{VALUE} is not a valid chapter status',
      },
      default: 'draft',
      index: true,
    },
    driveFolderId: {
      type: String,
      default: '',
    },
    pages: [
      {
        pageNumber: {
          type: Number,
          required: true,
        },
        fileId: {
          type: String,
          required: true,
        },
        imageUrl: {
          type: String,
          default: '',
        },
        originalName: {
          type: String,
          default: '',
        },
        width: {
          type: Number,
        },
        height: {
          type: Number,
        },
        mimeType: {
          type: String,
          default: 'image/webp',
        },
        fileSize: {
          type: Number,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Unique compound index so a manga cannot have duplicate chapter numbers
chapterSchema.index({ mangaId: 1, number: 1 }, { unique: true });
chapterSchema.index({ mangaId: 1, status: 1, number: -1 });

const Chapter = mongoose.model('Chapter', chapterSchema);

export default Chapter;
