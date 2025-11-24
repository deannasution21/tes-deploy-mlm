// config/roles.ts
export const rolePermissions = {
  // Member - most restricted
  member: {
    allowedPaths: [
      '/dashboard',
      '/diagram-jaringan',
      '/diagram-jaringan/:path*',
      '/pindah-id/',
      '/bonus/',
      '/bonus/:path*',
      '/withdrawal-bonus',
      '/withdrawal-bonus/:path*',
      '/withdrawal-gaji',
      '/withdrawal-gaji/:path*',
      '/lihat-pin',
      '/lihat-pin/:path*',
      '/transfer-pin',
      '/transfer-pin/:path*',
      '/stockist',
      '/stockist/:path*',
      '/peringkat',
      '/peringkat/:path*',
      '/profil',
      '/profil/:path*',
      '/download',
      '/download/:path*',
      '/profil-perusahaan',
      '/profil-perusahaan/:path*',
      '/promo',
      '/promo/:path*',
      '/kontak',
      '/kontak/:path*',
    ],
  },

  // Stockist - can access products + member features
  stockist: {
    allowedPaths: [
      '/dashboard',
      '/produk',
      '/produk/:path*',
      '/lihat-pin',
      '/lihat-pin/:path*',
      '/transfer-pin',
      '/transfer-pin/:path*',
      '/profil',
      '/profil/:path*',
    ],
  },

  // Admin Owner - full access
  admin: {
    allowedPaths: ['/dashboard', '/pindah-id/', '/profil', '/profil/:path*'],
  },

  // Admin Member - can manage members
  admin_member: {
    allowedPaths: ['/dashboard', '/profil', '/profil/:path*'],
  },

  // Admin Stock - can manage stockists + products
  admin_stock: {
    allowedPaths: [
      '/dashboard',
      '/produk',
      '/produk/:path*',
      '/stok',
      '/stok/:path*',
      '/profil',
      '/profil/:path*',
    ],
  },
} as const;

export type UserRole = keyof typeof rolePermissions;
