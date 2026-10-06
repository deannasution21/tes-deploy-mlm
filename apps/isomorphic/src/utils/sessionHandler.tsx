import { signOut } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Text } from 'rizzui'; // adjust if your Text component is elsewhere

let hasSignedOut = false;

// Dipanggil dari luar komponen (fetchWithAuth, interval), jadi tidak boleh
// pakai hook seperti useRouter(); redirect lewat window.location.
export function handleSessionExpired(role?: string, message?: string) {
  if (hasSignedOut) return;
  hasSignedOut = true;
  toast.error(
    <Text as="b">{message || 'Sesi telah habis, silakan login ulang'}</Text>,
    { duration: 5000 }
  );
  setTimeout(async () => {
    await signOut({ redirect: false });
    window.location.href =
      role === 'admin' || role === 'admin_stock' || role === 'admin_member'
        ? '/signin-admin-ipg-2025'
        : '/signin';
  }, 5000);
}

export function handleSessionError(message?: string) {
  toast.error(
    <Text as="b">{message || 'Terjadi kesalahan tak terduga'}</Text>,
    { duration: 5000 }
  );
}
