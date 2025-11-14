import { z } from 'zod';
import { InputSanitizer } from '@/shared/utils/sanitizer';

// Güvenli string validation (XSS koruması)
const safeString = z
  .string()
  .max(500, 'Maksimum 500 karakter')
  .transform((val) => InputSanitizer.sanitizeText(val));

// Kategori validation
const categorySchema = z
  .string()
  .max(50, 'Kategori adı çok uzun')
  .transform((val) => InputSanitizer.sanitizeCategory(val));

// Amount validation (güvenli sayı)
const amountSchema = z
  .number({
    required_error: 'Miktar giriniz',
    invalid_type_error: 'Geçerli bir miktar giriniz',
  })
  .positive('Miktar sıfırdan büyük olmalıdır')
  .max(999999999, 'Miktar çok yüksek')
  .transform((val) => InputSanitizer.sanitizeNumber(val));

// Tarih validation
const dateSchema = z
  .date({
    invalid_type_error: 'Geçerli bir tarih giriniz',
  })
  .optional()
  .transform((val) => {
    if (!val) return new Date();
    const validated = InputSanitizer.validateDate(val);
    return validated || new Date();
  });

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], {
    required_error: 'İşlem tipi seçmelisiniz',
    invalid_type_error: 'Geçersiz işlem tipi',
  }),
  amount: amountSchema,
  category: categorySchema.optional(),
  description: safeString.optional(),
  date: dateSchema,
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

// Settings validation
export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  currency: z.enum(['TRY', 'USD', 'EUR']),
  monthlyGoal: z.number().min(0).max(999999999),
  notifications: z.boolean(),
  language: z.string().max(10),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
