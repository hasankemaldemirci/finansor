import { z } from 'zod';
import { InputSanitizer } from '@/shared/utils/sanitizer';
import i18n from '@/shared/lib/i18n';

// Güvenli string validation (XSS koruması)
const safeString = z
  .string()
  .max(500, () => i18n.t('validation.maxLength', { max: 500 }))
  .transform((val) => InputSanitizer.sanitizeText(val));

// Kategori validation
const categorySchema = z
  .string()
  .max(50, () => i18n.t('validation.categoryTooLong'))
  .transform((val) => InputSanitizer.sanitizeCategory(val));

// Amount validation (güvenli sayı)
const amountSchema = z
  .number({
    required_error: () => i18n.t('validation.amountRequired'),
    invalid_type_error: () => i18n.t('validation.amountInvalid'),
  })
  .positive(() => i18n.t('validation.amountPositive'))
  .max(999999999, () => i18n.t('validation.amountTooHigh'))
  .transform((val) => InputSanitizer.sanitizeNumber(val));

// Tarih validation
const dateSchema = z
  .date({
    invalid_type_error: () => i18n.t('validation.dateInvalid'),
  })
  .optional()
  .transform((val) => {
    if (!val) return new Date();
    const validated = InputSanitizer.validateDate(val);
    return validated || new Date();
  });

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], {
    required_error: () => i18n.t('validation.typeRequired'),
    invalid_type_error: () => i18n.t('validation.typeInvalid'),
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
