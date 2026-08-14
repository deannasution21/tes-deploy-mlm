import { z } from 'zod';
import { messages } from '@/config/messages';

export const bulkUpdateMemberSchema = z.object({
  full_name: z.string().optional(),
  email: z
    .union([z.literal(''), z.string().email({ message: messages.invalidEmail })])
    .optional(),
  phone: z.string().optional(),
  province: z.string().optional(),
  city: z.string().optional(),
  nik: z.string().optional(),
  bank_name: z.string().optional(),
  bank_account_name: z.string().optional(),
  bank_account_number: z.string().optional(),
  npwp_name: z.string().optional(),
  npwp_number: z.string().optional(),
  npwp_address: z.string().optional(),
  heir_name: z.string().optional(),
  heir_relationship: z.string().optional(),
});

// generate form types from zod validation schema
export type BulkUpdateMemberInput = z.infer<typeof bulkUpdateMemberSchema>;
