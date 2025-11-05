import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateConfirmPassword, validatePassword } from './common-rules';

export const ubahPasswordSchema = z
  .object({
    username: z.string().min(1, { message: messages.kolomIsRequired }),
    old_password: validatePassword,
    new_password: validatePassword,
    new_match_password: validateConfirmPassword,
  })
  .refine((data) => data.new_password === data.new_match_password, {
    message: messages.passwordsDidNotMatch,
    path: ['new_match_password'], // Correct path for the confirm_password field
  });

// generate form types from zod validation schema
export type UbahPasswordInput = z.infer<typeof ubahPasswordSchema>;
