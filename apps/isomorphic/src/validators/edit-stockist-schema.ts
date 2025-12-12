import { z } from 'zod';
import { messages } from '@/config/messages';

export const editStockistSchema = z.object({
  username: z.string().min(1, { message: messages.kolomIsRequired }),
  master_username: z.string().min(1, { message: messages.kolomIsRequired }),
  nama: z.string().min(1, { message: messages.kolomIsRequired }),
  email: z
    .string()
    .min(1, { message: messages.kolomIsRequired })
    .email({ message: 'Format email tidak valid' }),
  phone: z.string().min(1, { message: messages.kolomIsRequired }),
  province: z.string().min(1, { message: messages.kolomIsRequired }),
  city: z.string().min(1, { message: messages.kolomIsRequired }),
  address: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .refine((val) => !val || val.length >= 15, {
      message: 'Alamat minimal 15 huruf',
    }),
});

// generate form types from zod validation schema
export type EditStockistInput = z.infer<typeof editStockistSchema>;
