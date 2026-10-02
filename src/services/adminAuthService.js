/**
 * Admin Authentication Service
 * 
 * Manages organizer authentication for the protected CHRONYX 2026 Dashboard.
 * Uses environment variables for credentials with clearly marked demo defaults for local development.
 * Stores session token securely in sessionStorage (cleared when browser tab/window closes).
 */

const SESSION_STORAGE_KEY = 'chronyx_admin_session_v1';

// Default demo credentials for local development
const DEMO_CONFIG = {
  email: 'admin@chronyx2026.jsec.ac.in',
  password: 'Chronyx@2026#Admin',
  role: 'Symposium Admin',
  department: 'Artificial Intelligence and Data Science',
  college: 'Jaya Sakthi Engineering College'
};

/**
 * Get configured admin credentials from environment or demo fallback
 */
export function getAdminConfig() {
  try {
    const envEmail = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ADMIN_EMAIL;
    const envPassword = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ADMIN_PASSWORD;

    return {
      email: envEmail ? String(envEmail).trim().toLowerCase() : DEMO_CONFIG.email.toLowerCase(),
      password: envPassword ? String(envPassword).trim() : DEMO_CONFIG.password,
      isDemo: !envEmail || !envPassword
    };
  } catch (e) {
    return {
      email: DEMO_CONFIG.email.toLowerCase(),
      password: DEMO_CONFIG.password,
      isDemo: true
    };
  }
}

/**
 * Authenticate admin with email and password
 */
export async function loginAdmin(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();
  const config = getAdminConfig();

  // Validate credentials
  if (cleanEmail !== config.email || cleanPassword !== config.password) {
    return { 
      success: false, 
      error: 'Invalid organizer credentials. Access denied.' 
    };
  }

  // Create secure session
  const sessionData = {
    email: cleanEmail,
    role: DEMO_CONFIG.role,
    college: DEMO_CONFIG.college,
    department: DEMO_CONFIG.department,
    loginAt: new Date().toISOString(),
    token: `chx26_adm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  };

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  } catch (err) {
    console.warn('SessionStorage unavailable, session stored in memory', err);
  }

  return { success: true, user: sessionData };
}

/**
 * Check if admin is currently authenticated
 */
export function isAdminAuthenticated() {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    return Boolean(session && session.token && session.email);
  } catch (e) {
    return false;
  }
}

/**
 * Get currently authenticated admin user
 */
export function getAuthenticatedAdmin() {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

/**
 * Log out admin and terminate session
 */
export function logoutAdmin() {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (e) {
    // ignore
  }
  return true;
}

export { DEMO_CONFIG };
