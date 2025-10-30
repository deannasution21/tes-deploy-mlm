import { z } from 'zod';
import { messages } from '@/config/messages';

export const withdrawalBonusSchema = z.object({
  username: z.string().min(1, { message: messages.kolomIsRequired }).optional(),
  // jumlah: z.string().min(1, { message: messages.kolomIsRequired }),
  // bank: z.string().min(1, { message: messages.kolomIsRequired }),
  // norek: z.string().min(1, { message: messages.kolomIsRequired }),
  // an: z.string().min(1, { message: messages.kolomIsRequired }),
  amount: z.coerce.number().min(1, { message: messages.kolomIsRequired }),
  type: z.string().optional(),
});

// generate form types from zod validation schema
export type WithdrawalBonusInput = z.infer<typeof withdrawalBonusSchema>;
