import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { isDbConnected } from '../config/database.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'compliscan_ai_default_jwt_secret_token_2026';

const __filename_auth = fileURLToPath(import.meta.url);
const __dirname_auth = path.dirname(__filename_auth);

// Ensure upload directory exists
const uploadDir = path.join(__dirname_auth, '..', 'uploads', 'avatars');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${req.userId}_${Date.now()}${ext}`);
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, JPEG, PNG, and WEBP images are allowed.'));
    }
  },
});

export const inMemoryUsers = new Map();

function initDefaultUsers() {
  const defaults = [
    {
      _id: 'super_admin_001',
      name: 'Super Admin (National Governance)',
      email: 'sih@gmail.com',
      password: '822115',
      role: 'super_admin',
      organization: 'Ministry of Consumer Affairs & FSSAI',
      profilePicture: 'https://ui-avatars.com/api/?name=Super+Admin&background=4f46e5&color=fff&bold=true',
      authProvider: 'email',
      createdAt: new Date('2026-01-01'),
    },
    {
      _id: 'inspector_002',
      name: 'Legal Metrology Officer',
      email: 'inspector@compliscan.ai',
      password: 'inspector123',
      role: 'admin',
      organization: 'Legal Metrology Division, Govt. of India',
      profilePicture: 'https://ui-avatars.com/api/?name=Metrology+Officer&background=10b981&color=fff&bold=true',
      authProvider: 'email',
      createdAt: new Date('2026-01-01'),
    },
    {
      _id: 'citizen_003',
      name: 'Citizen Inspector',
      email: 'demo@compliscan.ai',
      password: 'demo123',
      role: 'Citizen Inspector',
      organization: 'Public Consumer Cell',
      profilePicture: 'https://ui-avatars.com/api/?name=Citizen+User&background=6366f1&color=fff&bold=true',
      authProvider: 'email',
      createdAt: new Date('2026-01-01'),
    }
  ];

  for (const u of defaults) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(u.password, salt);
    inMemoryUsers.set(u.email.toLowerCase(), {
      ...u,
      passwordHash,
      _id: u._id,
      id: u._id,
    });
  }
}
initDefaultUsers();

export function findInMemoryUser(emailOrId) {
  const normalized = String(emailOrId).toLowerCase().trim();
  if (inMemoryUsers.has(normalized)) {
    return inMemoryUsers.get(normalized);
  }
  for (const u of inMemoryUsers.values()) {
    if (u._id === emailOrId || u.id === emailOrId) {
      return u;
    }
  }
  return null;
}

/**
 * Generate secure session token and set HTTP-only cookie
 */
function sendTokenResponse(user, statusCode, res) {
  const userId = user._id || user.id || 'usr_' + Date.now();
  const token = jwt.sign(
    { userId: String(userId), email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  };

  res.cookie('token', token, cookieOptions);

  const photo = user.profilePhotoUrl || user.profilePicture || '';

  return res.status(statusCode).json({
    success: true,
    token, // Also return for authorization header fallback
    user: {
      id: String(userId),
      name: user.name,
      email: user.email,
      profilePicture: photo,
      profilePhotoUrl: photo,
      authProvider: user.authProvider || 'email',
      role: user.role || 'Citizen Inspector',
      organization: user.organization || '',
      createdAt: user.createdAt || new Date(),
    },
  });
}

/**
 * POST /api/auth/register
 * Real user registration with bcrypt password hashing in MongoDB Atlas (with offline in-memory fallback)
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // 1. Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Full Name is required (minimum 2 characters).',
      });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'Passwords do not match. Please re-enter.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists in in-memory store
    if (inMemoryUsers.has(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists.',
      });
    }

    // Hash password securely using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff&bold=true`;

    let user = null;

    if (isDbConnected()) {
      try {
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            error: 'An account with this email already exists.',
          });
        }

        user = new User({
          name: name.trim(),
          email: normalizedEmail,
          passwordHash,
          profilePicture: defaultAvatar,
          authProvider: 'email',
          lastLoginAt: new Date(),
        });
        await user.save();
      } catch (dbErr) {
        console.warn('[MongoDB Register fallback to in-memory]:', dbErr.message);
      }
    }

    if (!user) {
      const memoryId = 'usr_' + Date.now();
      user = {
        _id: memoryId,
        id: memoryId,
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        profilePicture: defaultAvatar,
        authProvider: 'email',
        role: 'Citizen Inspector',
        organization: 'Independent Inspector',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };
    }

    // Save to in-memory registry
    inMemoryUsers.set(normalizedEmail, user);
    console.log(`[Auth Success]: Registered user "${user.name}" (${user.email})`);

    return sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('[Registration Error]:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Registration failed due to a server error. Please try again.',
    });
  }
});

/**
 * POST /api/auth/login
 * Real email + password verification against bcrypt hash in MongoDB Atlas & in-memory store
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check in-memory users first (guarantees instantaneous login even without DB)
    let user = findInMemoryUser(normalizedEmail);

    // 2. If not found in memory, check MongoDB
    if (!user && isDbConnected()) {
      try {
        user = await User.findOne({ email: normalizedEmail });
      } catch (dbErr) {
        console.warn('[MongoDB Lookup Error]:', dbErr.message);
      }
    }

    // 3. If user found, verify password
    if (user && user.passwordHash) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (isMatch) {
        if (typeof user.save === 'function') {
          user.lastLoginAt = new Date();
          await user.save().catch(() => {});
        }
        console.log(`[Auth Success]: User logged in "${user.name}" (${user.email})`);
        return sendTokenResponse(user, 200, res);
      }
    }

    // 4. Special fallback for Super Admin / Demo accounts if password matches default
    if (normalizedEmail === 'sih@gmail.com' && password === '822115') {
      const superAdmin = {
        _id: 'super_admin_001',
        id: 'super_admin_001',
        name: 'Super Admin (National Governance)',
        email: 'sih@gmail.com',
        role: 'super_admin',
        organization: 'Ministry of Consumer Affairs & FSSAI',
        profilePicture: 'https://ui-avatars.com/api/?name=Super+Admin&background=4f46e5&color=fff&bold=true',
        authProvider: 'email',
        createdAt: new Date('2026-01-01'),
      };
      return sendTokenResponse(superAdmin, 200, res);
    }

    if (normalizedEmail === 'inspector@compliscan.ai' && (password === 'inspector123' || password === 'password123')) {
      const officer = {
        _id: 'inspector_002',
        id: 'inspector_002',
        name: 'Legal Metrology Officer',
        email: 'inspector@compliscan.ai',
        role: 'admin',
        organization: 'Legal Metrology Division, Govt. of India',
        profilePicture: 'https://ui-avatars.com/api/?name=Metrology+Officer&background=10b981&color=fff&bold=true',
        authProvider: 'email',
        createdAt: new Date('2026-01-01'),
      };
      return sendTokenResponse(officer, 200, res);
    }

    if (normalizedEmail === 'demo@compliscan.ai' && (password === 'demo123' || password === '123456')) {
      const demoUser = {
        _id: 'citizen_003',
        id: 'citizen_003',
        name: 'Citizen Inspector',
        email: 'demo@compliscan.ai',
        role: 'Citizen Inspector',
        organization: 'Public Consumer Cell',
        profilePicture: 'https://ui-avatars.com/api/?name=Citizen+User&background=6366f1&color=fff&bold=true',
        authProvider: 'email',
        createdAt: new Date('2026-01-01'),
      };
      return sendTokenResponse(demoUser, 200, res);
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid email or password. You can also use one of the Quick Demo Login buttons below.',
    });
  } catch (error) {
    console.error('[Login Error]:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Sign in failed due to a server error. Please try again.',
    });
  }
});

/**
 * GET /api/auth/me
 * Retrieves current authenticated user profile
 */
router.get('/me', requireAuth, async (req, res) => {
  const photo = req.user.profilePhotoUrl || req.user.profilePicture || '';
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      profilePicture: photo,
      profilePhotoUrl: photo,
      authProvider: req.user.authProvider,
      role: req.user.role,
      organization: req.user.organization,
      createdAt: req.user.createdAt,
    },
  });
});

/**
 * POST /api/auth/logout
 * Clears authentication session & HTTP-only cookie
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return res.status(200).json({
    success: true,
    message: 'Signed out successfully.',
  });
});

/**
 * GET /api/auth/google & GET /api/auth/google/callback
 * Real Google OAuth integration endpoints
 */
router.get('/google', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

  if (!clientId) {
    return res.status(501).json({
      success: false,
      error: 'Google OAuth is not configured on the server yet. Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.',
    });
  }

  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: redirectUri,
    client_id: clientId,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  const qs = new URLSearchParams(options);
  return res.redirect(`${rootUrl}?${qs.toString()}`);
});

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

  if (!clientId || !clientSecret) {
    return res.redirect('/auth/login?error=google_oauth_not_configured');
  }

  try {
    // Exchange auth code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return res.redirect('/auth/login?error=google_auth_failed');
    }

    // Fetch user info from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const googleUser = await userRes.json();

    if (!googleUser.email) {
      return res.redirect('/auth/login?error=google_missing_email');
    }

    let user = await User.findOne({ email: googleUser.email.toLowerCase() });
    if (!user) {
      user = new User({
        name: googleUser.name || 'Google User',
        email: googleUser.email.toLowerCase(),
        profilePicture: googleUser.picture || '',
        authProvider: 'google',
        lastLoginAt: new Date(),
      });
      await user.save();
    } else {
      user.lastLoginAt = new Date();
      if (googleUser.picture && !user.profilePicture) {
        user.profilePicture = googleUser.picture;
      }
      await user.save();
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    const clientBase = process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.replace(/\/$/, '') : '';
    return res.redirect(`${clientBase}/dashboard`);
  } catch (err) {
    console.error('[Google OAuth Error]:', err.message);
    const clientBase = process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.replace(/\/$/, '') : '';
    return res.redirect(`${clientBase}/auth/login?error=google_server_error`);
  }
});

router.patch('/profile', requireAuth, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Name must be at least 2 characters.',
      });
    }
    
    if (name.trim().length > 60) {
      return res.status(400).json({
        success: false,
        error: 'Name cannot exceed 60 characters.',
      });
    }
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }
    
    user.name = name.trim();
    await user.save();
    
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture || '',
        authProvider: user.authProvider,
        role: user.role,
        organization: user.organization,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Profile Update Error]:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to update profile.' });
  }
});

router.patch('/profile/photo', requireAuth, handlePhotoUpload);
router.put('/profile/photo', requireAuth, handlePhotoUpload);

async function handlePhotoUpload(req, res) {
  avatarUpload.single('photo')(req, res, async (err) => {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE' 
        ? 'Image size is too large. Maximum allowed size is 5MB.' 
        : (err.message || 'Please select a valid image.');
      return res.status(400).json({
        success: false,
        error: message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please select an image file to upload.',
      });
    }

    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found.' });
      }

      // Delete old uploaded avatar if it was a local file
      const oldPhoto = user.profilePhotoUrl || user.profilePicture;
      if (oldPhoto && oldPhoto.startsWith('/uploads/')) {
        const cleanOld = oldPhoto.split('?')[0]; // Strip cache buster if any
        const oldPath = path.join(__dirname_auth, '..', cleanOld);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (e) {
            console.warn('[Photo Delete Warning]:', e.message);
          }
        }
      }

      // Store as relative URL path with a timestamp cache buster
      const photoUrl = `/uploads/avatars/${req.file.filename}`;
      user.profilePicture = photoUrl;
      user.profilePhotoUrl = photoUrl;
      await user.save();

      console.log(`[Photo Upload Success]: User ${user.email} updated profile photo to ${photoUrl}`);

      return res.status(200).json({
        success: true,
        profilePicture: photoUrl,
        profilePhotoUrl: photoUrl,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: photoUrl,
          profilePhotoUrl: photoUrl,
          authProvider: user.authProvider,
          role: user.role,
          organization: user.organization,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error('[Photo Upload Error]:', error.message);
      return res.status(500).json({ success: false, error: 'Failed to save photo.' });
    }
  });
}

/**
 * POST /api/auth/change-password
 * Allows authenticated users to change their account password securely
 */
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    if (user.authProvider === 'google') {
      return res.status(400).json({
        success: false,
        error: 'Google-authenticated accounts do not use a standard password.',
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters long.',
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'New password and confirmation do not match.',
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect current password.',
      });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    console.log(`[Password Changed]: User ${user.email} changed password`);

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully! Please use your new password next time you sign in.',
    });
  } catch (error) {
    console.error('[Change Password Error]:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to change password.' });
  }
});

/**
 * DELETE /api/auth/profile/photo
 * Remove custom profile photo and revert to initials avatar
 */
router.delete('/profile/photo', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    // Delete existing local file if present
    const oldPhoto = user.profilePhotoUrl || user.profilePicture;
    if (oldPhoto && oldPhoto.startsWith('/uploads/')) {
      const cleanOld = oldPhoto.split('?')[0];
      const oldPath = path.join(__dirname_auth, '..', cleanOld);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.warn('[Photo Delete Warning]:', e.message);
        }
      }
    }

    // Set profile picture to empty string / null
    user.profilePicture = '';
    user.profilePhotoUrl = '';
    await user.save();

    console.log(`[Photo Removed]: User ${user.email} deleted profile photo`);

    return res.status(200).json({
      success: true,
      message: 'Profile photo removed successfully.',
      profilePicture: '',
      profilePhotoUrl: '',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: '',
        profilePhotoUrl: '',
        authProvider: user.authProvider,
        role: user.role,
        organization: user.organization,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Photo Delete Error]:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to remove photo.' });
  }
});

/**
 * Super Admin Seeder Helper
 */
export async function seedSuperAdmin() {
  try {
    console.log('[Super Admin Seeder]: Function called.');

    if (!isDbConnected()) {
      console.warn('[Super Admin Seeder]: Database is NOT connected.');
      return;
    }
    const SUPER_EMAIL = 'sih@gmail.com';
    const SUPER_PASS = '822115';
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(SUPER_PASS, salt);

    let superUser = await User.findOne({ email: SUPER_EMAIL });
    if (!superUser) {
      superUser = new User({
        name: 'Super Admin (National Governance)',
        email: SUPER_EMAIL,
        passwordHash,
        authProvider: 'email',
        role: 'super_admin',
        organization: 'Ministry of Consumer Affairs & FSSAI',
      });
      await superUser.save();
      console.log('[Super Admin Seeded]: sih@gmail.com initialized as super_admin');
    } else {
      superUser.role = 'super_admin';
      superUser.passwordHash = passwordHash;
      superUser.organization = 'Ministry of Consumer Affairs & FSSAI';
      await superUser.save();
    }
  } catch (err) {
    console.warn('[Super Admin Seed Warning]:', err.message);
  }
}

// Automatically seed Super Admin on route load
setTimeout(seedSuperAdmin, 2500);

/**
 * GET /api/auth/admins
 * Super Admin Only: List all appointed ministry admins / officers
 */
router.get('/admins', requireAuth, async (req, res) => {
  try {
    const isSuper = req.user.email === 'sih@gmail.com' || req.user.role === 'super_admin';
    if (!isSuper) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: Only Super Admin (sih@gmail.com) can manage officers.',
      });
    }

    const admins = await User.find({
      role: { $in: ['admin', 'Ministry Enforcement Officer', 'super_admin'] }
    }).select('-passwordHash').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      admins: admins.map((a) => ({
        id: a._id,
        name: a.name,
        email: a.email,
        role: a.role,
        organization: a.organization,
        createdAt: a.createdAt,
        lastLoginAt: a.lastLoginAt,
      })),
    });
  } catch (error) {
    console.error('[Get Admins Error]:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to retrieve admin list.' });
  }
});

/**
 * POST /api/auth/admins
 * Super Admin Only: Appoint a new Ministry Admin with assigned password & department
 */
router.post('/admins', requireAuth, async (req, res) => {
  try {
    const isSuper = req.user.email === 'sih@gmail.com' || req.user.role === 'super_admin';
    if (!isSuper) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: Only Super Admin can appoint new administrators.',
      });
    }

    const { name, email, password, organization = 'Ministry Enforcement Cell' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and assigned password are required.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({ email: normalizedEmail });
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    if (user) {
      // Elevate existing user to admin with the assigned password
      user.name = name.trim();
      user.role = 'admin';
      user.organization = organization;
      user.passwordHash = passwordHash;
      await user.save();
    } else {
      user = new User({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        authProvider: 'email',
        role: 'admin',
        organization,
        lastLoginAt: new Date(),
      });
      await user.save();
    }

    console.log(`[Admin Appointed]: Super Admin created officer "${user.name}" (${user.email})`);

    return res.status(201).json({
      success: true,
      message: `Ministry Officer ${user.name} successfully appointed!`,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Create Admin Error]:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to appoint officer.' });
  }
});

/**
 * DELETE /api/auth/admins/:id
 * Super Admin Only: Revoke an officer's admin privileges
 */
router.delete('/admins/:id', requireAuth, async (req, res) => {
  try {
    const isSuper = req.user.email === 'sih@gmail.com' || req.user.role === 'super_admin';
    if (!isSuper) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: Only Super Admin can revoke officer permissions.',
      });
    }

    const adminUser = await User.findById(req.params.id);
    if (!adminUser) {
      return res.status(404).json({ success: false, error: 'Officer record not found.' });
    }

    if (adminUser.email === 'sih@gmail.com') {
      return res.status(400).json({
        success: false,
        error: 'Super Admin account (sih@gmail.com) cannot be removed.',
      });
    }

    // Downgrade role or delete
    adminUser.role = 'Citizen Inspector';
    await adminUser.save();

    console.log(`[Admin Revoked]: Super Admin revoked officer ${adminUser.email}`);

    return res.status(200).json({
      success: true,
      message: `Officer access revoked for ${adminUser.name}.`,
    });
  } catch (error) {
    console.error('[Revoke Admin Error]:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to revoke officer.' });
  }
});

export default router;
