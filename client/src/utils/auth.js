const SESSION_KEY = 'taskflow_session_v2'; // Store { token, email }

/** Save auth session (JWT) */
function saveSession(token, email) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ token, email }));
}

/** Get logged-in user session, or null */
export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

/** Get JWT specifically */
export function getToken() {
  const session = getSession();
  return session ? session.token : null;
}

/** Clear session (sign out) */
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/** Utility to generate auth headers */
export function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

/** Register a new user securely via backend API */
export async function registerUser(email, password) {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');

    // Save JWT token on successful register
    saveSession(data.token, data.email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/** Login securely via backend API */
export async function loginUser(email, password) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    // Save JWT token on successful login
    saveSession(data.token, data.email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
