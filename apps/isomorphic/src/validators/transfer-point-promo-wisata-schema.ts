import { z } from 'zod';
import { messages } from '@/config/messages';

export const transferPointWisataSchema = z.object({
  to: z.string().min(1, { message: messages.kolomIsRequired }),
  token: z.string().min(1, { message: messages.kolomIsRequired }),
  amount: z.coerce.number().min(1, { message: 'Minimal 1 POINT' }),
});

export const transferPointWisataStockistSchema = z.object({
  to: z.string().min(1, { message: messages.kolomIsRequired }),
  amount: z.coerce.number().min(1, { message: 'Minimal 1 POINT' }),
});

export const penarikanPinSchema = z.object({
  from: z.string().min(1, { message: messages.kolomIsRequired }),
  to: z.string().min(1, { message: messages.kolomIsRequired }),
  type_pin: z
    .string({
      required_error: messages.kolomIsRequired,
    })
    .min(1, { message: messages.kolomIsRequired }),
  amount: z.coerce.number().min(1, { message: 'Minimal 1 POINT' }),
  note: z.string().optional(),
});

// generate form types from zod validation schema
export type TransferPointWisataInput = z.infer<
  typeof transferPointWisataSchema
>;
export type TransferPointWisataStockistInput = z.infer<
  typeof transferPointWisataStockistSchema
>;
export type PenarikanPinInput = z.infer<typeof penarikanPinSchema>;
