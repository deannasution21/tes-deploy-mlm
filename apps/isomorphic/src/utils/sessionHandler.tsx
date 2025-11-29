import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Text } from 'rizzui'; // adjust if your Text component is elsewhere

let hasSignedOut = false;

export function handleSessionExpired(role?: string, message?: string) {
  const router = useRouter();

  if (hasSignedOut) return;
  hasSignedOut = true;
  toast.error(
    <Text as="b">{message || 'Sesi telah habis, silakan login ulang'}</Text>,
    { duration: 5000 }
  );
  setTimeout(async () => {
    await signOut({ redirect: false });
    router.push(
      role === 'admin' || role === 'admin_stock' || role === 'admin_member'
        ? '/signin-admin-ipg-2025'
        : '/signin'
    );
  }, 5000);
}

export function handleSessionError(message?: string) {
  toast.error(
    <Text as="b">{message || 'Terjadi kesalahan tak terduga'}</Text>,
    { duration: 5000 }
  );
}
