import express from 'express';
import { isDatabaseConnected } from '../config/database.js';

const router = express.Router();

router.get('/', (req, res) => {
  const dbConnected = isDatabaseConnected();

  res.status(200).json({
    success: true,
    message: 'API is running',
    database: dbConnected ? 'connected' : 'disconnected',
  });
});

export default router;
