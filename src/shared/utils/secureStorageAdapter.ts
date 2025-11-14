import { StateStorage, createJSONStorage } from 'zustand/middleware';
import { SecureStorage } from './crypto';

// Zustand için güvenli storage adapter
const secureStateStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      // Önce şifreli veriyi kontrol et
      const value = SecureStorage.getItem<any>(name);
      if (value) {
        // Zustand'ın persist formatı: {state: {...}, version: 0}
        // Eğer value zaten bu formattaysa, direkt stringify et
        // Eğer sadece state objesi ise, Zustand formatına çevir
        let zustandFormat = value;
        if (
          value &&
          typeof value === 'object' &&
          !value.state &&
          !value.version
        ) {
          // Sadece state objesi var, Zustand formatına çevir
          zustandFormat = { state: value, version: 0 };
        }
        return JSON.stringify(zustandFormat);
      }

      // Şifreli veri yoksa, eski formatı kontrol et (migration için)
      const unencrypted = localStorage.getItem(name);
      if (unencrypted) {
        try {
          const parsed = JSON.parse(unencrypted);
          // Otomatik olarak şifrele ve eski veriyi sil
          SecureStorage.setItem(name, parsed);
          localStorage.removeItem(name);
          return unencrypted; // Zustand zaten parse edecek
        } catch {
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error(
        `[SecureStorageAdapter] GetItem failed for: ${name}`,
        error
      );
      // Fallback: normal localStorage (eski veriler için)
      try {
        return localStorage.getItem(name);
      } catch {
        return null;
      }
    }
  },

  setItem: (name: string, value: string): void => {
    try {
      // Zustand'ın persist middleware'i her zaman JSON string gönderir
      // Ama type guard ekleyelim (bazı edge case'lerde object gelebilir)
      if (typeof value !== 'string') {
        // Eğer value string değilse, stringify et
        const stringValue = JSON.stringify(value);
        const parsed = JSON.parse(stringValue);
        SecureStorage.setItem(name, parsed);
        return;
      }

      const parsed = JSON.parse(value);
      SecureStorage.setItem(name, parsed);
    } catch (error) {
      // Eğer JSON.parse başarısız olursa, fallback olarak normal localStorage kullan
      // Bu durum genellikle circular reference veya özel değerler nedeniyle olur
      console.error(
        `[SecureStorageAdapter] SetItem failed for: ${name}`,
        error
      );
      const stringValue =
        typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(name, stringValue);
    }
  },

  removeItem: (name: string): void => {
    SecureStorage.removeItem(name);
    // Fallback: normal localStorage
    localStorage.removeItem(name);
  },
};

// Zustand'ın createJSONStorage ile sarmalayarak PersistStorage'a çevir
export const secureStorageAdapter = <T>() => {
  return createJSONStorage<T>(() => secureStateStorage);
};
