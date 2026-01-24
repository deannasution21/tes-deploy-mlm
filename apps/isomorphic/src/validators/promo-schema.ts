import { z } from 'zod';
import { messages } from '@/config/messages';

export const promoSchema = z.object({
  // package_id: z.coerce
  //   .number()
  //   .int()
  //   .positive({ message: messages.kolomIsRequired }),
  package_id: z.string().min(1, { message: 'Pilih promo terlebih dahulu' }),
});

// generate form types from zod validation schema
export type PromoInput = z.infer<typeof promoSchema>;
