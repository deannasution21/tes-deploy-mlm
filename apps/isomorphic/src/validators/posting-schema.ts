import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateConfirmPassword, validatePassword } from './common-rules';

export const postingSchema = z
  .object({
    pin_code: z.string().min(1, { message: messages.kolomIsRequired }),
    mlm_user_id: z.string().min(1, { message: messages.kolomIsRequired }),
    type_plan: z.string().min(1, { message: messages.kolomIsRequired }),
    upline: z.string().min(1, { message: messages.kolomIsRequired }),
    sponsor: z.string().min(1, { message: messages.kolomIsRequired }),
    position: z.string().min(1, { message: messages.kolomIsRequired }),
    full_name: z.string().min(1, { message: messages.kolomIsRequired }),
    email: z.string().min(1, { message: messages.kolomIsRequired }),
    phone: z.string().min(1, { message: messages.kolomIsRequired }),
    province: z.string().min(1, { message: messages.kolomIsRequired }),
    city: z.string().min(1, { message: messages.kolomIsRequired }),
    bank_name: z.string().min(1, { message: messages.kolomIsRequired }),
    bank_account_name: z.string().min(1, { message: messages.kolomIsRequired }),
    bank_account_number: z
      .string()
      .min(1, { message: messages.kolomIsRequired }),
    nik: z
      .string()
      .min(1, { message: messages.kolomIsRequired })
      .min(16, { message: 'NIK minimal 16 digit' }),
    npwp_name: z.string().min(1, { message: messages.kolomIsRequired }),
    npwp_number: z
      .string()
      .min(1, { message: messages.kolomIsRequired })
      .min(15, { message: 'NPWP minimal 15 digit' }),
    npwp_address: z.string().min(1, { message: messages.kolomIsRequired }),
    heir_name: z.string().min(1, { message: messages.kolomIsRequired }),
    heir_relationship: z.string().min(1, { message: messages.kolomIsRequired }),
    password: validatePassword,
    confirm_password: validateConfirmPassword,
  })
  .refine((data) => data.password === data.confirm_password, {
    message: messages.passwordsDidNotMatch,
    path: ['confirm_password'], // Correct path for the confirm_password field
  });

// generate form types from zod validation schema
export type PostingInput = z.infer<typeof postingSchema>;
