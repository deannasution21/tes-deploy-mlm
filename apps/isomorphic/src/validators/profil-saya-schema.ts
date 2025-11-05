import { z } from 'zod';
import { messages } from '@/config/messages';

export const profilSayaSchema = z.object({
  username: z.string().min(1, { message: messages.kolomIsRequired }),
  nama: z.string().min(1, { message: messages.kolomIsRequired }),
  email: z
    .string()
    .min(1, { message: messages.kolomIsRequired })
    .email({ message: 'Format email tidak valid' }),
  no_hp: z.string().min(1, { message: messages.kolomIsRequired }),
  nama_bank: z.string().min(1, { message: messages.kolomIsRequired }),
  nama_pemilik_rekening: z
    .string()
    .min(1, { message: messages.kolomIsRequired }),
  no_rekening: z.string().min(1, { message: messages.kolomIsRequired }),
});

// generate form types from zod validation schema
export type ProfilSayaInput = z.infer<typeof profilSayaSchema>;
