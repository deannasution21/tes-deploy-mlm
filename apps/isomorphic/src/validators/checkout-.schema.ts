import { z } from 'zod';
import { messages } from '@/config/messages';

export const checkoutSchema = z
  .object({
    customer_name: z.string().min(1, { message: messages.kolomIsRequired }),
    customer_phone: z
      .string({
        required_error: messages.kolomIsRequired,
      })
      .min(10, { message: 'Minimal 10 digit' })
      .max(13, { message: 'Maksimal 13 digit' }),
    shipping_method: z.string().optional(), // defaultvalue is "pickup"
    shipping_address: z.string().optional(),
    province: z.string().optional(),
    city: z.string().optional(),
    kecamatan: z.string().optional(),
    kelurahan: z.string().optional(),
    payment_method: z.string({ required_error: messages.kolomIsRequired }),
  })
  .superRefine((data, ctx) => {
    if (data.shipping_method === 'delivery') {
      // User memilih "kirim ke alamat"
      if (!data.shipping_address) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['shipping_address'],
          message: messages.kolomIsRequired,
        });
      }
      if (!data.province) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['province'],
          message: messages.kolomIsRequired,
        });
      }
      if (!data.city) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['city'],
          message: messages.kolomIsRequired,
        });
      }
      if (!data.kecamatan) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['kecamatan'],
          message: messages.kolomIsRequired,
        });
      }
      if (!data.kelurahan) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['kelurahan'],
          message: messages.kolomIsRequired,
        });
      }
    }
  });

// generate form types from zod validation schema
export type CheckoutInput = z.infer<typeof checkoutSchema>;
