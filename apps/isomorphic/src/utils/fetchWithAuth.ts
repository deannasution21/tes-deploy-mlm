import { handleSessionError, handleSessionExpired } from './sessionHandler';

export async function fetchWithAuth<T = any>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        'x-app-token': token ?? '',
      },
    });

    // 🧩 Handle HTTP errors
    if (!res.ok) {
      // Try to parse JSON error response
      const errBody = (await res.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };

      const message =
        errBody?.message || errBody?.error || `HTTP error! ${res.status}`;

      // If session expired (401)
      if (res.status === 401) {
        handleSessionExpired();
        throw new Error('Unauthorized');
      }

      throw new Error(message);
    }

    // ✅ Return parsed JSON
    return res.json() as Promise<T>;
  } catch (error: any) {
    if (
      error.message?.includes('Failed to fetch') ||
      error.message?.includes('NetworkError') ||
      error.message?.includes('Load failed') ||
      error.name === 'TypeError'
    ) {
      // 💡 No internet → show toast only, don’t logout
      handleSessionError('Tidak ada koneksi internet');
    } else if (error.message === 'Unauthorized') {
      // 401 handled above, but safe fallback
      handleSessionExpired('Sesi telah habis, silakan login ulang');
    } else {
      handleSessionError(error.message || 'Terjadi kesalahan tak terduga');
    }

    console.error('fetchWithAuth error:', error);
    throw error;
  }
}
