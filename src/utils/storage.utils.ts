const isBrowser = (): boolean => typeof window !== "undefined";

export const storage = {
  get: <T>(key: string): T | null => {
    if (!isBrowser()) return null;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T): boolean => {
    if (!isBrowser()) return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove: (key: string): boolean => {
    if (!isBrowser()) return false;
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear: (): boolean => {
    if (!isBrowser()) return false;
    try {
      window.localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },
};