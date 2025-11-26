import { z } from 'zod';
import { messages } from '@/config/messages';

export const editMemberSchema = z.object({
  mlm_user_id: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  upline: z.string().min(1, { message: messages.kolomIsRequired }),
  sponsor: z.string().min(1, { message: messages.kolomIsRequired }),
  full_name: z.string().min(1, { message: messages.kolomIsRequired }),
  email: z
    .string()
    .min(1, { message: messages.kolomIsRequired })
    .email({ message: 'Format email tidak valid' }),
  phone: z.string().min(1, { message: messages.kolomIsRequired }),
  province: z.string().min(1, { message: messages.kolomIsRequired }),
  city: z.string().min(1, { message: messages.kolomIsRequired }),
  bank_name: z.string().min(1, { message: messages.kolomIsRequired }),
  bank_account_name: z.string().min(1, { message: messages.kolomIsRequired }),
  bank_account_number: z.string().min(1, { message: messages.kolomIsRequired }),
  nik: z
    .string()
    .min(1, { message: messages.kolomIsRequired })
    .regex(/^\d{16}$/, { message: 'NIK harus terdiri dari 16 digit angka' }),
  npwp_name: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  npwp_number: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .refine((val) => !val || /^\d{15}$/.test(val), {
      message: 'NPWP harus terdiri dari 15 digit angka',
    }),
  npwp_address: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .refine((val) => !val || val.length >= 15, {
      message: 'Alamat NPWP minimal 15 huruf',
    }),
  heir_name: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .refine((val) => !val || val.length >= 1, {
      message: messages.kolomIsRequired,
    }),
  heir_relationship: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .optional()
    .refine((val) => !val || val.length >= 1, {
      message: messages.kolomIsRequired,
    }),
});

// generate form types from zod validation schema
export type EditMemberInput = z.infer<typeof editMemberSchema>;
