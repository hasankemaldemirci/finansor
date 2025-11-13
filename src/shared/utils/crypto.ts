import CryptoJS from 'crypto-js';

// Güvenli anahtar türetme için cihaza özel salt
const SALT = 'finansor-app-2024-secure-salt';
const KEY_STORAGE_KEY = 'finansor_encryption_key';

class CryptoService {
  private static instance: CryptoService;
  private encryptionKey: string | null = null;

  private constructor() {
    this.initializeKey();
  }

  static getInstance(): CryptoService {
    if (!CryptoService.instance) {
      CryptoService.instance = new CryptoService();
    }
    return CryptoService.instance;
  }

  // Cihaza özel anahtar oluştur veya yükle
  private initializeKey(): void {
    try {
      // Mevcut anahtarı yükle
      const storedKey = localStorage.getItem(KEY_STORAGE_KEY);
      
      if (storedKey) {
        this.encryptionKey = storedKey;
        return;
      }
      
      // Yeni anahtar oluştur (cihaza özel)
      // Önce device ID'yi al veya oluştur
      const deviceId = this.getDeviceId();
      
      // Device ID'den key türet
      this.encryptionKey = CryptoJS.PBKDF2(deviceId, SALT, {
        keySize: 256 / 32,
        iterations: 10000,
      }).toString();
      
      // Anahtarı sakla (sonraki kullanımlar için)
      try {
        localStorage.setItem(KEY_STORAGE_KEY, this.encryptionKey);
      } catch (storageError) {
        console.error('[CryptoService] Failed to store encryption key:', storageError);
        // Key'i saklayamadık ama kullanabiliriz
      }
    } catch (error) {
      console.error('[CryptoService] Key initialization failed:', error);
      // Fallback: basit anahtar (device ID'den)
      try {
        const deviceId = this.getDeviceId();
        this.encryptionKey = CryptoJS.SHA256(SALT + deviceId).toString();
        // Fallback key'i de saklamaya çalış
        try {
          localStorage.setItem(KEY_STORAGE_KEY, this.encryptionKey);
        } catch {
          // Storage dolu olabilir, devam et
        }
      } catch {
        // Son çare: user agent'dan key
        this.encryptionKey = CryptoJS.SHA256(SALT + navigator.userAgent).toString();
      }
    }
  }

  // Cihaza özel ID oluştur
  private getDeviceId(): string {
    try {
      // Mevcut device ID'yi kontrol et
      let deviceId = localStorage.getItem('finansor_device_id');
      
      if (!deviceId) {
        // Yeni device ID oluştur
        const components = [
          navigator.userAgent,
          navigator.language,
          screen.width + 'x' + screen.height,
          new Date().getTimezoneOffset().toString(),
        ];
        
        deviceId = CryptoJS.SHA256(components.join('|')).toString();
        localStorage.setItem('finansor_device_id', deviceId);
      }
      
      return deviceId;
    } catch (error) {
      // Fallback
      return CryptoJS.SHA256(navigator.userAgent + Date.now()).toString();
    }
  }

  // Veriyi şifrele
  encrypt(data: string): string {
    if (!this.encryptionKey) {
      this.initializeKey();
    }

    try {
      const encrypted = CryptoJS.AES.encrypt(data, this.encryptionKey!).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Encryption failed');
    }
  }

  // Veriyi çöz
  decrypt(encryptedData: string): string {
    if (!this.encryptionKey) {
      this.initializeKey();
    }

    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey!);
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) {
        throw new Error('Invalid or corrupted data');
      }
      
      return decryptedString;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Decryption failed. Data may be corrupted.');
    }
  }

  // Anahtar var mı kontrol et
  isInitialized(): boolean {
    return this.encryptionKey !== null;
  }
}

export const cryptoService = CryptoService.getInstance();

// Güvenli LocalStorage wrapper - Otomatik şifreleme
export class SecureStorage {
  private static getStorageKey(key: string): string {
    return `secure_${key}`;
  }

  // Veriyi şifreleyerek sakla
  static setItem(key: string, value: any): void {
    let jsonString: string;
    try {
      jsonString = JSON.stringify(value);
    } catch (stringifyError) {
      console.error('JSON stringify failed:', stringifyError);
      throw new Error('Failed to serialize data');
    }

    try {
      const encrypted = cryptoService.encrypt(jsonString);
      localStorage.setItem(this.getStorageKey(key), encrypted);
    } catch (error) {
      console.error('Secure storage set failed:', error);
      // Fallback: şifrelenmemiş sakla (eski veriler için)
      try {
        localStorage.setItem(key, jsonString);
      } catch (fallbackError) {
        console.error('Fallback storage also failed:', fallbackError);
        throw new Error('Failed to save data');
      }
    }
  }

  // Şifreli veriyi çözerek getir
  static getItem<T>(key: string): T | null {
    try {
      // Önce şifreli veriyi kontrol et
      const encrypted = localStorage.getItem(this.getStorageKey(key));
      if (encrypted) {
        try {
          const decrypted = cryptoService.decrypt(encrypted);
          const parsed = JSON.parse(decrypted) as T;
          return parsed;
        } catch (decryptError) {
          // Şifre çözme başarısız - key değişmiş olabilir veya veri bozulmuş
          console.error(`[SecureStorage] Decryption failed for key: ${key}`, decryptError);
          // Eski formatı kontrol et (migration için)
          const unencrypted = localStorage.getItem(key);
          if (unencrypted) {
            try {
              const parsed = JSON.parse(unencrypted) as T;
              // Otomatik olarak şifrele ve eski veriyi sil
              this.setItem(key, parsed);
              localStorage.removeItem(key);
              return parsed;
            } catch {
              return null;
            }
          }
          return null;
        }
      }

      // Şifreli veri yok, eski şifrelenmemiş veriyi kontrol et (migration için)
      const unencrypted = localStorage.getItem(key);
      if (unencrypted) {
        try {
          const parsed = JSON.parse(unencrypted) as T;
          // Otomatik olarak şifrele ve eski veriyi sil
          this.setItem(key, parsed);
          localStorage.removeItem(key);
          return parsed;
        } catch {
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error(`[SecureStorage] Get failed for key: ${key}`, error);
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(this.getStorageKey(key));
    // Eski veriyi de sil (migration için)
    localStorage.removeItem(key);
  }

  static clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('secure_') || 
          key === 'transactions-storage' || 
          key === 'gamification-storage' || 
          key === 'settings-storage') {
        localStorage.removeItem(key);
      }
    });
  }

  // Şifreli veri var mı kontrol et
  static hasEncryptedData(): boolean {
    const keys = Object.keys(localStorage);
    return keys.some(key => key.startsWith('secure_'));
  }
}
