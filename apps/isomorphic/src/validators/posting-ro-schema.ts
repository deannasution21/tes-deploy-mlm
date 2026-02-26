import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateConfirmPassword, validatePassword } from './common-rules';

export const postingROSchema = z.object({
  pin_code: z.string().min(1, { message: messages.kolomIsRequired }),
  mlm_user_id: z
    .string()
    .transform((val) => (val === '' ? undefined : val))
    .optional(),
  type_plan: z.string().min(1, { message: messages.kolomIsRequired }),
});

// generate form types from zod validation schema
export type PostingROInput = z.infer<typeof postingROSchema>;
