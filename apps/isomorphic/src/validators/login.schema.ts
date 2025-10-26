import { messages } from '@/config/messages';
import { z } from 'zod';

// form zod validation schema
export const loginSchema = z.object({
  username: z.string().min(1, { message: messages.kolomIsRequired }),
  password: z.string().min(1, { message: messages.kolomIsRequired }),
  rememberMe: z.boolean().optional(),
});

// generate form types from zod validation schema
export type LoginSchema = z.infer<typeof loginSchema>;
