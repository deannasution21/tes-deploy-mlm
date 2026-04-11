import { z } from 'zod';

export const generatePointWisataSchema = z.object({
  amount: z.coerce.number().min(1, { message: 'Minimal 1 POINT' }),
});

// generate form types from zod validation schema
export type GeneratePointWisataInput = z.infer<
  typeof generatePointWisataSchema
>;
