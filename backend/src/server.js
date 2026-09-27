import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/database.js';
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import mangaRoutes from './routes/mangaRoutes.js';
import chapterRoutes from './routes/chapterRoutes.js';
import storageRoutes from './routes/storageRoutes.js';
import adminUploadRoutes from './routes/adminUploadRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

// Load environment variables from backend/.env or root
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows image streaming to reader
  })
);

// CORS Configuration (Specific origins allowed, not wildcard *)
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl/Postman in dev)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/manga', mangaRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api', storageRoutes); // Controlled image stream route /api/reader/pages/:fileId
app.use('/api/admin', adminUploadRoutes);


// 404 & Global Error Middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server ONLY after MongoDB connects successfully
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`NOVA PANEL Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server due to database connection error.');
    process.exit(1);
  }
}

startServer();

export default app;
