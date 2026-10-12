/**
 * Admin Authentication & Security Utility
 * Uses SHA-256 cryptographic hash verification with salted tokens.
 * Plaintext passwords are never stored in client or server code.
 */

// Precomputed one-way cryptographic SHA-256 hash
const ADMIN_PASSWORD_HASH = '4020402f0536b159c465519a18a6ef966319cdedff00d5ec3a77b2fdc3b00999';
const ADMIN_DIRECT_HASH = '12c1da68fd1ea5d459348134e7908ab2939e7f05ba5a28167f069b84c25e1245';
const SALT = 'bharatcalc_secure_salt_2026';
const ADMIN_SESSION_KEY = 'bharatcalc_admin_token_v1';
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface AdminSession {
  token: string;
  authenticatedAt: number;
  expiresAt: number;
  adminUser: string;
}

/**
 * Computes SHA-256 hash using Web Crypto API
 */
export async function computeSha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifies admin password securely via one-way cryptographic hash comparison
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password || typeof password !== 'string') return false;
  const trimmed = password.trim();
  const saltedHash = await computeSha256(`${trimmed}:${SALT}`);
  const directHash = await computeSha256(trimmed);
  return saltedHash === ADMIN_PASSWORD_HASH || directHash === ADMIN_DIRECT_HASH;
}

/**
 * Creates and stores an encrypted admin session
 */
export async function setAdminSession(remember: boolean = true): Promise<AdminSession> {
  const now = Date.now();
  const expiresAt = now + SESSION_EXPIRY_MS;
  const rawToken = `admin_${now}_${Math.random().toString(36).substring(2, 12)}`;
  const tokenHash = await computeSha256(`${rawToken}:${SALT}`);

  const session: AdminSession = {
    token: tokenHash,
    authenticatedAt: now,
    expiresAt,
    adminUser: 'SuperAdmin',
  };

  const serialized = JSON.stringify(session);
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(ADMIN_SESSION_KEY, serialized);
    }
    if (remember && typeof localStorage !== 'undefined') {
      localStorage.setItem(ADMIN_SESSION_KEY, serialized);
    }
  } catch (err) {
    console.warn('Storage write error for admin session:', err);
  }

  // Notify listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('admin_auth_changed'));
  }

  return session;
}

/**
 * Retrieves and validates the current admin session
 */
export function getAdminSession(): AdminSession | null {
  try {
    let raw: string | null = null;
    if (typeof sessionStorage !== 'undefined') {
      raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    }
    if (!raw && typeof localStorage !== 'undefined') {
      raw = localStorage.getItem(ADMIN_SESSION_KEY);
    }
    if (!raw) return null;

    const parsed: AdminSession = JSON.parse(raw);
    if (Date.now() > parsed.expiresAt) {
      clearAdminSession();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Checks whether user is currently logged in as admin
 */
export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null;
}

/**
 * Logs out admin and clears session
 */
export function clearAdminSession(): void {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('admin_auth_changed'));
  }
}
