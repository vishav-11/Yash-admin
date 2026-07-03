import { env } from "@/config/env.config";
import { storage } from "@/utils/storage.utils";

export const tokenManager = {
  getToken: (): string | null => {
    return storage.get<string>(env.auth.tokenKey);
  },

  setToken: (token: string): boolean => {
    return storage.set(env.auth.tokenKey, token);
  },

  removeToken: (): boolean => {
    return storage.remove(env.auth.tokenKey);
  },

  hasToken: (): boolean => {
    const token = storage.get<string>(env.auth.tokenKey);
    return token !== null && token !== "";
  },

  getUser: <T>(): T | null => {
    return storage.get<T>(env.auth.userKey);
  },

  setUser: <T>(admin: T): boolean => {
    return storage.set(env.auth.userKey, admin);
  },

  removeUser: (): boolean => {
    return storage.remove(env.auth.userKey);
  },

  clearAll: (): void => {
    tokenManager.removeToken();
    tokenManager.removeUser();
  },
};