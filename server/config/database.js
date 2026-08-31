/**
 * MongoDB Atlas Connection Configuration
 * Uses Mongoose to connect securely to the MongoDB cluster.
 * Protects secrets and never logs credentials or raw connection strings.
 */

import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim().length === 0) {
    console.warn('[MongoDB Atlas Warning]: MONGODB_URI is not set. Scans will be cached in memory only.');
    return false;
  }

  try {
    // Sanitize connection URI for logging (mask credentials if present)
    const sanitizedLog = uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.log(`[MongoDB Atlas]: Attempting connection to ${sanitizedLog}...`);

    await mongoose.connect(uri, {
      dbName: 'compliscan_ai',
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log('[MongoDB Atlas]: Successfully connected to database: compliscan_ai');
    return true;
  } catch (error) {
    console.error('[MongoDB Atlas Connection Error]:', error.message);
    isConnected = false;
    return false;
  }
}

export function isDbConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

export default connectDB;
