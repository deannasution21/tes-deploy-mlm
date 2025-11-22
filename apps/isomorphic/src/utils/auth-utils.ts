// lib/auth-utils.ts
import { rolePermissions, UserRole } from '@/config/roles';

export function isPathAllowed(pathname: string, role: UserRole): boolean {
  const permissions = rolePermissions[role];

  // First check denied paths (explicit denial)
  for (const deniedPath of permissions.deniedPaths) {
    if (matchesPathPattern(pathname, deniedPath)) {
      return false;
    }
  }

  // Then check allowed paths
  for (const allowedPath of permissions.allowedPaths) {
    if (matchesPathPattern(pathname, allowedPath)) {
      return true;
    }
  }

  // If not explicitly allowed or denied, default to deny
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
    adminmember: '/dashboard',
    adminstock: '/dashboard',
    adminowner: '/dashboard',
  };

  return redirectPaths[role];
}
