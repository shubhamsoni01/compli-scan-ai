import { API_BASE_URL } from './api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  profilePhotoUrl?: string;
  authProvider?: string;
  role?: string;
  organization?: string;
  createdAt?: string | Date;
}

const AUTH_USER_KEY = 'compliscan_user_data';

/**
 * Check if a user is currently authenticated
 */
export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_USER_KEY) !== null;
}

/**
 * Get current authenticated user details
 */
export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Verify current session with backend GET /api/auth/me
 */
export async function checkSession(): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      localStorage.removeItem(AUTH_USER_KEY);
      return null;
    }

    const data = await res.json();
    if (data.success && data.user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
      return data.user;
    }
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  } catch {
    return getCurrentUser();
  }
}

/**
 * Real user registration via POST /api/auth/register
 */
export async function signup(
  name: string,
  email: string,
  password: string,
  confirmPassword?: string
): Promise<AuthUser> {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      name,
      email,
      password,
      confirmPassword: confirmPassword || password,
    }),
  });

  const data = await responseJsonSafe(res);
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Registration failed. Please check your details.');
  }

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
  if (data.token) {
    localStorage.setItem('compliscan_jwt', data.token);
  }
  return data.user;
}

async function responseJsonSafe(res: Response): Promise<any> {
  try {
    return await res.json();
  } catch {
    return { success: false, error: 'Server response error.' };
  }
}

/**
 * Real user login via POST /api/auth/login
 */
export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const data = await responseJsonSafe(res);
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Invalid email or password.');
  }

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
  if (data.token) {
    localStorage.setItem('compliscan_jwt', data.token);
  }
  return data.user;
}

/**
 * Real user logout via POST /api/auth/logout
 */
export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    console.warn('[Logout API error]:', err);
  } finally {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem('compliscan_jwt');
  }
}
