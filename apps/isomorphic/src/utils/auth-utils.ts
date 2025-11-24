// lib/auth-utils.ts
import { rolePermissions, UserRole } from '@/config/roles';

// lib/auth-utils.ts - SIMPLIFIED
export function isPathAllowed(pathname: string, role: UserRole): boolean {
  const permissions = rolePermissions[role];

  // ONLY check allowed paths - everything else is denied by default
  for (const allowedPath of permissions.allowedPaths) {
    if (matchesPathPattern(pathname, allowedPath)) {
      return true;
    }
  }

  // If not in allowed paths, automatically deny
  return false;
}

function matchesPathPattern(pathname: string, pattern: string): boolean {
  if (pattern.endsWith('/:path*')) {
    const basePath = pattern.replace('/:path*', '');
    return pathname.startsWith(basePath);
  }

  return pathname === pattern;
}

export function getRedirectPath(role: UserRole): string {
  const redirectPaths: Record<UserRole, string> = {
    member: '/dashboard',
    stockist: '/dashboard',
    admin: '/dashboard',
    admin_member: '/dashboard',
    admin_stock: '/dashboard',
  };

  return redirectPaths[role];
}
