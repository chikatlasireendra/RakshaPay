import { User } from '../types';
import { authService as localAuthService } from './authServiceLocal';
import { apiPatch, apiPost, clearApiToken, getApiToken, setApiToken } from './apiClient';

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export const authService = {
  // Authentication is now backend-authoritative. A stale local demo session
  // without a FastAPI token is never treated as authenticated.
  isAuthenticated(): boolean {
    const token = getApiToken();
    const localSession = localAuthService.isAuthenticated();
    if (!token || !localSession) return false;
    return true;
  },

  getCurrentUser(): User {
    return localAuthService.getCurrentUser();
  },

  setCurrentUser(user: User): void {
    localAuthService.setCurrentUser(user);
  },

  async login(email: string, password?: string): Promise<AuthResponse> {
    try {
      const result = await apiPost<AuthResponse>('/api/auth/login', {
        email: email.trim(),
        password: password || '',
      });
      if (!result.success || !result.user || !result.token) {
        return { success: false, error: result.error || 'Login failed.' };
      }
      setApiToken(result.token);
      localAuthService.setCurrentUser(result.user);
      return result;
    } catch (error) {
      // IMPORTANT: never silently create/log in a user when the backend rejects
      // credentials. This was the reason arbitrary credentials appeared valid.
      clearApiToken();
      localAuthService.logout();
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unable to authenticate with the RakshaPay server.'
      };
    }
  },

  async register(
    name: string,
    email: string,
    password?: string,
    phoneNumber?: string,
    avatarUrl?: string
  ): Promise<User> {
    const result = await apiPost<{ success: boolean; token: string; user: User }>('/api/auth/register', {
      name,
      email,
      phoneNumber: phoneNumber || '',
      password: password || '',
      avatarUrl: avatarUrl || 'avatar-human-1',
      acceptedTerms: true,
    });
    setApiToken(result.token);
    localAuthService.setCurrentUser(result.user);
    return result.user;
  },

  logout(): void {
    clearApiToken();
    localAuthService.logout();
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const updated = await apiPatch<User>('/api/profile', updates);
    localAuthService.setCurrentUser(updated);
    return updated;
  }
};
