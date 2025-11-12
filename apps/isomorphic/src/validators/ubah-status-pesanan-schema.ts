import { z } from 'zod';
import { messages } from '@/config/messages';

export const ubahStatusPesananSchema = z.object({
  ref_id: z.string().min(1, { message: messages.kolomIsRequired }),
  status: z
    .string({
      required_error: messages.kolomIsRequired,
    })
    .min(1, { message: messages.kolomIsRequired }),
});

// generate form types from zod validation schema
export type UbahStatusPesananInput = z.infer<typeof ubahStatusPesananSchema>;
