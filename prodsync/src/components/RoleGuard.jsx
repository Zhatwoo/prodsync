'use client';

import { useAuth } from '../contexts/AuthContext';
import { hasRole, hasMinimumRole, ROLES } from '../lib/roles';

/**
 * RoleGuard component for role-based access control
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render if access is granted
 * @param {string|string[]} props.roles - Required role(s) for access
 * @param {string} props.minimumRole - Minimum role level required
 * @param {React.ReactNode} props.fallback - Content to render if access is denied
 * @param {boolean} props.requireAll - If true, user must have ALL specified roles
 * @param {boolean} props.showFallback - Whether to show fallback content or nothing
 */
export default function RoleGuard({ 
  children, 
  roles, 
  minimumRole, 
  fallback = null, 
  requireAll = false,
  showFallback = true 
}) {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return showFallback ? fallback : null;
  }

  // Check role-based access
  let hasAccess = false;

  if (roles) {
    if (requireAll) {
      // User must have ALL specified roles
      hasAccess = Array.isArray(roles) 
        ? roles.every(role => hasRole(user.role, role))
        : hasRole(user.role, roles);
    } else {
      // User must have ANY of the specified roles
      hasAccess = hasRole(user.role, roles);
    }
  }

  if (minimumRole) {
    // Check minimum role level
    hasAccess = hasMinimumRole(user.role, minimumRole);
  }

  // If no roles or minimumRole specified, grant access to authenticated users
  if (!roles && !minimumRole) {
    hasAccess = true;
  }

  if (hasAccess) {
    return children;
  }

  return showFallback ? fallback : null;
}

/**
 * Higher-order component for role-based access control
 * 
 * @param {React.Component} Component - Component to wrap
 * @param {Object} roleConfig - Role configuration
 * @param {string|string[]} roleConfig.roles - Required role(s)
 * @param {string} roleConfig.minimumRole - Minimum role level
 * @param {React.ReactNode} roleConfig.fallback - Fallback content
 * @param {boolean} roleConfig.requireAll - Require all roles
 */
export function withRoleGuard(Component, roleConfig = {}) {
  return function RoleGuardedComponent(props) {
    return (
      <RoleGuard {...roleConfig}>
        <Component {...props} />
      </RoleGuard>
    );
  };
}

/**
 * Hook for role-based access control
 * 
 * @param {string|string[]} roles - Required role(s)
 * @param {string} minimumRole - Minimum role level
 * @param {boolean} requireAll - Require all roles
 * @returns {Object} Access control information
 */
export function useRoleAccess(roles, minimumRole, requireAll = false) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading || !isAuthenticated || !user) {
    return {
      hasAccess: false,
      loading,
      isAuthenticated,
      user: null
    };
  }

  let hasAccess = false;

  if (roles) {
    if (requireAll) {
      hasAccess = Array.isArray(roles) 
        ? roles.every(role => hasRole(user.role, role))
        : hasRole(user.role, roles);
    } else {
      hasAccess = hasRole(user.role, roles);
    }
  }

  if (minimumRole) {
    hasAccess = hasMinimumRole(user.role, minimumRole);
  }

  if (!roles && !minimumRole) {
    hasAccess = true;
  }

  return {
    hasAccess,
    loading: false,
    isAuthenticated,
    user
  };
}

/**
 * Specific role guard components for common use cases
 */
export const AdminGuard = ({ children, fallback = null }) => (
  <RoleGuard roles={ROLES.ADMIN} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const HRGuard = ({ children, fallback = null }) => (
  <RoleGuard roles={[ROLES.ADMIN, ROLES.HR]} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const ManagerGuard = ({ children, fallback = null }) => (
  <RoleGuard minimumRole={ROLES.HR} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const EmployeeGuard = ({ children, fallback = null }) => (
  <RoleGuard minimumRole={ROLES.EMPLOYEE} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const SalesGuard = ({ children, fallback = null }) => (
  <RoleGuard roles={[ROLES.ADMIN, ROLES.SALES_AGENT, ROLES.TELEMARKETER]} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const FinanceGuard = ({ children, fallback = null }) => (
  <RoleGuard roles={[ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.AUDITOR]} fallback={fallback}>
    {children}
  </RoleGuard>
);
