import { api } from './api';
import { storageService } from './storage';
import type { LoginCredentials, User } from '../types';

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response: any = await api.post('/api/auth', {
      action: 'signin',
      ...credentials,
    });
    console.log('Auth response:', JSON.stringify(response));

    // Try different response shapes the backend might return
    let token: string;
    let user: User;

    if (response.data?.token && response.data?.user) {
      // { message, data: { token, user } }
      token = response.data.token;
      user = response.data.user;
    } else if (response.token && response.user) {
      // { message, token, user }
      token = response.token;
      user = response.user;
    } else {
      console.error('Unexpected response shape:', response);
      throw new Error('Invalid response from server');
    }

    storageService.setToken(token);
    storageService.setUser(user);
    return { token, user };
  },

  logout: () => {
    storageService.clearAll();
  },

  getCurrentUser: (): User | null => {
    return storageService.getUser();
  },

  isAuthenticated: (): boolean => {
    return !!storageService.getToken();
  },

  refreshToken: async (): Promise<string> => {
    const response: any = await api.post('/api/auth', {
      action: 'refresh-token',
    });
    const token = response.data?.token || response.token;
    storageService.setToken(token);
    return token;
  },
};