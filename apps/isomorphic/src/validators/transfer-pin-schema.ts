import { z } from 'zod';
import { messages } from '@/config/messages';

export const transferPinSchema = z.object({
  to: z.string().min(1, { message: messages.kolomIsRequired }),
  token: z.string().min(1, { message: messages.kolomIsRequired }),
  type_pin: z
    .string({
      required_error: messages.kolomIsRequired,
    })
    .min(1, { message: messages.kolomIsRequired }),
  amount: z.coerce.number().min(1, { message: 'Minimal 1 PIN' }),
});

// generate form types from zod validation schema
export type TransferPinInput = z.infer<typeof transferPinSchema>;
