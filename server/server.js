import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, isDbConnected } from './config/database.js';

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB Atlas asynchronously
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

import cookieParser from 'cookie-parser';

// Security & Cross-Origin settings
const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or tools with no origin
    if (!origin) return callback(null, true);
    // Allow specified origins or Vercel preview deployments
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS policy.'));
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'CompliScan AI Backend Engine',
    ocrConfigured: Boolean(process.env.OCR_SPACE_API_KEY && process.env.OCR_SPACE_API_KEY !== ''),
    groqConfigured: Boolean(process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== ''),
    groqModel: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
    mongoConfigured: Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI !== ''),
    mongoConnected: isDbConnected(),
    timestamp: new Date().toISOString(),
  });
});

// Import API Routes
import authRouter from './routes/auth.js';
import ocrRouter from './routes/ocr.js';
import analyzeRouter from './routes/analyze.js';
import reportRouter from './routes/report.js';
import scansRouter from './routes/scans.js';
import statsRouter from './routes/stats.js';

app.use('/api/auth', authRouter);
app.use('/api/ocr', ocrRouter);
app.use('/api/analyze', analyzeRouter);
app.use('/api/report', reportRouter);
app.use('/api/scans', scansRouter);
app.use('/api/stats', statsRouter);

// Global Error Handler
app.use((err, _req, res, _next) => {
  console.error('[Unhandled Server Error]:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'An internal server error occurred.',
  });
});

app.listen(PORT, () => {
  console.log(`[CompliScan Server] Secure backend running on http://127.0.0.1:${PORT}`);
  if (!process.env.OCR_SPACE_API_KEY) {
    console.warn('[Warning] OCR_SPACE_API_KEY is not set in .env');
  }
  if (!process.env.GROQ_API_KEY) {
    console.warn('[Warning] GROQ_API_KEY is not set in .env');
  }
});
