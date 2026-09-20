import { User } from '../types';

const CURRENT_USER_KEY = 'scamshield_current_user';
const AUTH_SESSION_KEY = 'scamshield_session_active';
const ACTIVE_VIEW_KEY = 'scamshield_active_view';

export const authService = {
  isAuthenticated(): boolean {
    return localStorage.getItem(AUTH_SESSION_KEY) === 'true';
  },

  getCurrentUser(): User {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (stored) {
      try { return JSON.parse(stored) as User; } catch { /* ignore */ }
    }
    // Safe non-authenticated placeholder. App no longer treats this as a login.
    return {
      id: 'anonymous', name: 'Guest', email: '', role: 'user', avatarUrl: 'avatar-shield',
      phoneNumber: '', createdAt: new Date().toISOString().slice(0, 10),
      analysesCount: 0, reportsSubmitted: 0, reportsVerified: 0,
      confirmedThreatsCount: 0, savedPatterns: [], trustScore: null
    };
  },

  setCurrentUser(user: User): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    localStorage.setItem(AUTH_SESSION_KEY, 'true');
  },

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(ACTIVE_VIEW_KEY);
  }
};
