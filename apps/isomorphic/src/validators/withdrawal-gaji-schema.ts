import { z } from 'zod';
import { messages } from '@/config/messages';

export const withdrawalGajiSchema = z.object({
  username: z.string().min(1, { message: messages.kolomIsRequired }).optional(),
  type: z.string().optional(),
});

// generate form types from zod validation schema
export type WithdrawalGajiInput = z.infer<typeof withdrawalGajiSchema>;
