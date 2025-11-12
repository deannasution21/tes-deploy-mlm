import { signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Text } from 'rizzui'; // adjust if your Text component is elsewhere

let hasSignedOut = false;

export function handleSessionExpired(message?: string) {
  if (hasSignedOut) return;
  hasSignedOut = true;
  toast.error(
    <Text as="b">{message || 'Sesi telah habis, silakan login ulang'}</Text>,
    { duration: 5000 }
  );
  setTimeout(() => signOut(), 5000);
}

export function handleSessionError(message?: string) {
  toast.error(
    <Text as="b">{message || 'Terjadi kesalahan tak terduga'}</Text>,
    { duration: 5000 }
  );
}
