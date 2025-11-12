import { z } from 'zod';

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], {
    required_error: 'İşlem tipi seçmelisiniz',
  }),
  amount: z
    .number({
      required_error: 'Miktar giriniz',
      invalid_type_error: 'Geçerli bir miktar giriniz',
    })
    .positive('Miktar sıfırdan büyük olmalıdır'),
  category: z.string().optional(),
  description: z.string().optional(),
  date: z.date().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

