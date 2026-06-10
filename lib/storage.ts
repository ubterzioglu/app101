// Thin AsyncStorage wrapper used for the query persister and small caches.

import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async get(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async set(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // Non-fatal: caching is best-effort.
    }
  },
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // Non-fatal.
    }
  },
};

export { default as asyncStorage } from '@react-native-async-storage/async-storage';
