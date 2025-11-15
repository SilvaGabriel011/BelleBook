'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

interface AccountStatusGuardProps {
  children: React.ReactNode;
}

/**
 * Guard component that restricts access based on user's account status
 * - SUSPENDED: Redirects to account-suspended page
 * - PENDING_APPROVAL: Redirects to pending-approval page
 * - REJECTED: Allows access (user can continue as customer and reapply)
 * - ACTIVE: Full access granted
 */
export function AccountStatusGuard({ children }: AccountStatusGuardProps) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    // Block suspended accounts completely
    if (user.accountStatus === 'SUSPENDED') {
      router.push('/account-suspended');
      return;
    }

    // Redirect pending approval accounts
    if (user.accountStatus === 'PENDING_APPROVAL') {
      // Allow access to specific routes only
      const currentPath = window.location.pathname;
      const allowedPaths = ['/pending-approval', '/logout', '/profile'];

      if (!allowedPaths.some((path) => currentPath.startsWith(path))) {
        router.push('/pending-approval');
      }
    }
  }, [user, router]);

  // Don't render children if account is not active and not on allowed pages
  if (user && user.accountStatus !== 'ACTIVE') {
    const currentPath = window.location.pathname;

    if (user.accountStatus === 'SUSPENDED') {
      return null; // Will redirect to suspended page
    }

    if (user.accountStatus === 'PENDING_APPROVAL') {
      const allowedPaths = ['/pending-approval', '/logout', '/profile'];
      if (!allowedPaths.some((path) => currentPath.startsWith(path))) {
        return null; // Will redirect to pending approval
      }
    }
  }

  return <>{children}</>;
}
