export const USERS_KEY = 'psybioneer-users';

const DEFAULT_USERS = [
  { email: 'prueba@hotmail.com', password: 'prueba123', role: 'patient' },
  { email: 'doctor@psybioneer.com', password: 'doctor123', role: 'therapist' }
];

export function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function ensureDefaultUsers() {
  const users = getStoredUsers();
  const defaultEmails = DEFAULT_USERS.map(u => u.email.toLowerCase());
  const missingUsers = DEFAULT_USERS.filter(
    defaultUser => !users.some(u => String(u.email || '').trim().toLowerCase() === defaultUser.email.toLowerCase())
  );
  if (missingUsers.length > 0) {
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, ...missingUsers]));
  }
}

export function findUserByCredentials(email, password) {
  const normalized = String(email || '').trim().toLowerCase();
  return getStoredUsers().find((u) => String(u.email || '').trim().toLowerCase() === normalized && String(u.password || '') === password);
}