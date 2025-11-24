import { z } from 'zod';
import { messages } from '@/config/messages';

export const stokFormSchema = z.object({
  stock: z.coerce.number().min(1, { message: messages.kolomIsRequired }),
  stock_pin: z.coerce.number().min(1, { message: messages.kolomIsRequired }),
});

// generate form types from zod validation schema
export type StokFormInput = z.infer<typeof stokFormSchema>;
