import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({
  id: 'infyenergy-storage',
});

export { storage };

export const StorageKeys = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  ONBOARDING: 'onboarding_complete',
};

export const storageService = {
  setToken: (token: string) => {
    try {
      storage.set(StorageKeys.AUTH_TOKEN, token);
    } catch (e) {
      console.error('Error storing token:', e);
    }
  },
  getToken: (): string | undefined => {
    try {
      return storage.getString(StorageKeys.AUTH_TOKEN);
    } catch (e) {
      console.error('Error getting token:', e);
      return undefined;
    }
  },
  removeToken: () => {
    try {
      storage.delete(StorageKeys.AUTH_TOKEN);
    } catch (e) {
      console.error('Error removing token:', e);
    }
  },

  setUser: (user: object) => {
    try {
      storage.set(StorageKeys.USER_DATA, JSON.stringify(user));
    } catch (e) {
      console.error('Error storing user:', e);
    }
  },
  getUser: () => {
    try {
      const data = storage.getString(StorageKeys.USER_DATA);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error getting user:', e);
      return null;
    }
  },
  removeUser: () => {
    try {
      storage.delete(StorageKeys.USER_DATA);
    } catch (e) {
      console.error('Error removing user:', e);
    }
  },

  clearAll: () => {
    try {
      storage.clearAll();
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
  },
};