import { z } from 'zod';
import { messages } from '@/config/messages';

export const produkFormSchema = z.object({
  name: z.string().min(1, { message: messages.kolomIsRequired }),
  plan: z.string().min(1, { message: messages.kolomIsRequired }),
  price: z.coerce
    .number({
      required_error: messages.kolomIsRequired,
      invalid_type_error: 'Harga harus berupa angka',
    })
    .min(50000, { message: 'Harga minimal Rp 50.000' }),
  description: z.string().min(1, { message: messages.kolomIsRequired }),
  stock: z.coerce.number().min(1, { message: messages.kolomIsRequired }),
  stock_pin: z.coerce.number().min(1, { message: messages.kolomIsRequired }),
  min_order_quantity: z.coerce
    .number()
    .min(1, { message: messages.kolomIsRequired }),
});

// generate form types from zod validation schema
export type ProdukFormInput = z.infer<typeof produkFormSchema>;
