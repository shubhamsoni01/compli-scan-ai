import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'compliscan_ai_default_jwt_secret_token_2026';

/**
 * Authentication Middleware
 * Validates JWT token from HTTP-only cookie or Authorization Bearer header
 */
export async function requireAuth(req, res, next) {
  try {
    let token = null;

    // 1. Check HTTP-only cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Check Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please sign in to continue.',
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Session expired or invalid. Please sign in again.',
      });
    }

    // Lookup user in MongoDB Atlas
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User account not found. Please register or sign in again.',
      });
    }

    // Attach authenticated user to request
    req.user = user;
    req.userId = user._id.toString();

    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Authentication failed. Please sign in.',
    });
  }
}

/**
 * Optional Auth Middleware
 * Populates req.user if a valid token is present, but doesn't block if not
 */
export async function optionalAuth(req, _res, next) {
  try {
    let token = null;
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = user;
        req.userId = user._id.toString();
      }
    }
  } catch {
    // Ignore invalid token in optionalAuth
  }
  next();
}
