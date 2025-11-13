// XSS ve injection saldırılarına karşı input temizleme

export class InputSanitizer {
  // HTML karakterlerini escape et
  static escapeHtml(input: string): string {
    const htmlEscapeMap: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };

    return input.replace(/[&<>"'/]/g, (match) => htmlEscapeMap[match]);
  }

  // Script taglarını ve tehlikeli içerikleri temizle
  static removeScripts(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:text\/html/gi, '');
  }

  // SQL injection karakterlerini temizle
  static sanitizeSql(input: string): string {
    return input
      .replace(/['";\\]/g, '')
      .replace(/(\b(ALTER|CREATE|DELETE|DROP|EXEC|INSERT|SELECT|UNION|UPDATE)\b)/gi, '');
  }

  // Genel input temizleme (transaction açıklamaları için)
  static sanitizeText(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    return this.removeScripts(this.escapeHtml(input.trim()))
      .slice(0, 500); // Max 500 karakter
  }

  // Sayısal değerleri doğrula ve temizle
  static sanitizeNumber(input: any): number {
    if (typeof input === 'number' && !isNaN(input) && isFinite(input)) {
      return Math.abs(input); // Negatif değerleri pozitif yap
    }

    if (typeof input === 'string') {
      const cleaned = input.replace(/[^\d.,]/g, '');
      const number = parseFloat(cleaned.replace(',', '.'));
      
      if (!isNaN(number) && isFinite(number)) {
        return Math.abs(number);
      }
    }

    return 0;
  }

  // Email formatını doğrula
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Kategori adlarını doğrula (sadece belirli karakterler)
  static sanitizeCategory(input: string): string {
    return input
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .toLowerCase()
      .slice(0, 50);
  }

  // Tarih formatını doğrula
  static validateDate(dateInput: any): Date | null {
    if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
      return dateInput;
    }

    if (typeof dateInput === 'string') {
      const date = new Date(dateInput);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    return null;
  }

  // Transaction verilerini toplu temizle
  static sanitizeTransactionData(data: any): {
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: Date;
  } | null {
    try {
      // Type validation
      const validTypes = ['income', 'expense'];
      const type = validTypes.includes(data.type) ? data.type : 'expense';

      // Amount validation
      const amount = this.sanitizeNumber(data.amount);
      if (amount <= 0 || amount > 999999999) {
        throw new Error('Invalid amount');
      }

      // Category validation
      const category = this.sanitizeCategory(data.category || 'other');
      if (!category) {
        throw new Error('Invalid category');
      }

      // Description sanitization
      const description = this.sanitizeText(data.description || '');

      // Date validation
      const date = this.validateDate(data.date) || new Date();

      return {
        type,
        amount,
        category,
        description,
        date,
      };
    } catch (error) {
      console.error('Transaction data sanitization failed:', error);
      return null;
    }
  }

  // Rate limiting için basit kontrol
  static checkRateLimit(key: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowKey = `rate_limit_${key}`;
    
    try {
      const stored = localStorage.getItem(windowKey);
      const data = stored ? JSON.parse(stored) : { count: 0, resetTime: now + windowMs };

      if (now > data.resetTime) {
        // Reset window
        data.count = 1;
        data.resetTime = now + windowMs;
      } else {
        data.count++;
      }

      localStorage.setItem(windowKey, JSON.stringify(data));

      return data.count <= maxRequests;
    } catch {
      return true; // Hata durumunda izin ver
    }
  }
}

// Validation hooks
export const useInputValidation = () => {
  const validateTransactionInput = (data: any): string[] => {
    const errors: string[] = [];

    if (!data.type || !['income', 'expense'].includes(data.type)) {
      errors.push('Geçersiz işlem tipi');
    }

    const amount = InputSanitizer.sanitizeNumber(data.amount);
    if (amount <= 0) {
      errors.push('Tutar 0\'dan büyük olmalıdır');
    }
    if (amount > 999999999) {
      errors.push('Tutar çok yüksek');
    }

    if (!data.category || data.category.length === 0) {
      errors.push('Kategori seçilmelidir');
    }

    if (data.description && data.description.length > 500) {
      errors.push('Açıklama çok uzun (max 500 karakter)');
    }

    return errors;
  };

  return { validateTransactionInput };
};
