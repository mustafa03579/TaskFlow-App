/**
 * Simple auth helpers using localStorage.
 * Stores users as: { email, password } (plain text for demo — replace with hashed in production).
 */

const USERS_KEY = 'taskflow_users';
const SESSION_KEY = 'taskflow_session';

/** Get all registered users */
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

/** Save updated users list */
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** Register a new user. Returns { success, error } */
export function registerUser(email, password) {
  const emailLower = email.trim().toLowerCase();
  const users = getUsers();

  if (users.find(u => u.email === emailLower)) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  users.push({ email: emailLower, password });
  saveUsers(users);
  saveSession(emailLower);
  return { success: true };
}

/** Sign in an existing user. Returns { success, error } */
export function loginUser(email, password) {
  const emailLower = email.trim().toLowerCase();
  const users = getUsers();

  const match = users.find(u => u.email === emailLower);

  if (!match) {
    return { success: false, error: 'No account found with this email address.' };
  }

  if (match.password !== password) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  saveSession(emailLower);
  return { success: true };
}

/** Save current session */
function saveSession(email) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
}

/** Get logged-in user email, or null */
export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

/** Clear session (sign out) */
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
