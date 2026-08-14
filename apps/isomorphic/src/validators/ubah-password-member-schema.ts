import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateConfirmPassword, validatePassword } from './common-rules';

export const ubahPasswordMemberSchema = z
  .object({
    username: z.string().min(1, { message: messages.kolomIsRequired }),
    new_password: validatePassword,
    new_match_password: validateConfirmPassword,
  })
  .refine((data) => data.new_password === data.new_match_password, {
    message: messages.passwordsDidNotMatch,
    path: ['new_match_password'],
  });

// generate form types from zod validation schema
export type UbahPasswordMemberInput = z.infer<typeof ubahPasswordMemberSchema>;
