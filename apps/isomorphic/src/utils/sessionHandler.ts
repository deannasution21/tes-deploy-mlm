import { signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';

let hasSignedOut = false;

export function handleSessionExpired(message?: string) {
  if (hasSignedOut) return;
  hasSignedOut = true;
  toast.error(message || 'Sesi telah habis, silakan login ulang');
  setTimeout(() => signOut(), 500);
}

export function handleSessionError(message?: string) {
  toast.error(message || 'Terjadi kesalahan tak terduga');
}
