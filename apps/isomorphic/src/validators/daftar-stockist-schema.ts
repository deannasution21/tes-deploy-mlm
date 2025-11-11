import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateConfirmPassword, validatePassword } from './common-rules';

export const daftarStockistSchema = z
  .object({
    master_username: z.string().min(1, { message: messages.kolomIsRequired }),
    username: z.string().min(1, { message: messages.kolomIsRequired }),
    type_stockist: z.string().min(1, { message: messages.kolomIsRequired }),
    full_name: z.string().min(1, { message: messages.kolomIsRequired }),
    email: z
      .string()
      .min(1, { message: messages.kolomIsRequired })
      .email({ message: 'Format email tidak valid' }),
    phone: z.string().min(1, { message: messages.kolomIsRequired }),
    province: z.string().min(1, { message: messages.kolomIsRequired }),
    address: z.string().min(1, { message: messages.kolomIsRequired }),
    city: z.string().min(1, { message: messages.kolomIsRequired }),
    password: validatePassword,
    confirm_password: validateConfirmPassword,
  })
  .refine((data) => data.password === data.confirm_password, {
    message: messages.passwordsDidNotMatch,
    path: ['confirm_password'], // Correct path for the confirm_password field
  });

// generate form types from zod validation schema
export type DaftarStockistInput = z.infer<typeof daftarStockistSchema>;
