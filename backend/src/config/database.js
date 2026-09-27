import mongoose from 'mongoose';

/**
 * Connect to MongoDB safely without logging credentials
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message || 'Failed to connect');
    throw error;
  }
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}
