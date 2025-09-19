'use client';

import { usePermissions } from '../hooks/usePermissions';

/**
 * PermissionGuard component for conditional rendering based on permissions
 * @param {object} props - Component props
 * @param {string|string[]} props.permission - Single permission or array of permissions to check
 * @param {string} props.operation - Operation to check (view, create, edit, delete)
 * @param {string} props.module - Module to check (employee, payroll, timekeeping, benefits, department, position)
 * @param {string} props.role - Specific role to check (overrides current user role)
 * @param {boolean} props.requireAll - If true, requires ALL permissions; if false, requires ANY permission
 * @param {React.ReactNode} props.children - Content to render if permission check passes
 * @param {React.ReactNode} props.fallback - Content to render if permission check fails
 * @param {boolean} props.hide - If true, renders nothing when permission fails; if false, renders fallback
 * @returns {React.ReactNode} - Rendered content or null
 */
export default function PermissionGuard({
  permission,
  operation,
  module,
  role,
  requireAll = false,
  children,
  fallback = null,
  hide = false
}) {
  const { can, canAny, canAll, canPerform, role: currentRole, loading } = usePermissions();

  // Don't render anything while loading
  if (loading) {
    return null;
  }

  // Use provided role or current user role
  const userRole = role || currentRole;

  // If no role, don't render
  if (!userRole) {
    return hide ? null : fallback;
  }

  let hasAccess = false;

  // Check permissions based on provided props
  if (permission) {
    if (Array.isArray(permission)) {
      hasAccess = requireAll ? canAll(permission) : canAny(permission);
    } else {
      hasAccess = can(permission);
    }
  } else if (operation && module) {
    hasAccess = canPerform(operation, module);
  } else {
    // If no specific permission check is provided, default to no access
    hasAccess = false;
  }

  // Render based on access
  if (hasAccess) {
    return children;
  } else {
    return hide ? null : fallback;
  }
}

/**
 * Higher-order component for protecting components with permissions
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {object} permissionConfig - Permission configuration
 * @returns {React.Component} - Wrapped component with permission protection
 */
export const withPermission = (WrappedComponent, permissionConfig) => {
  return function PermissionWrappedComponent(props) {
    return (
      <PermissionGuard {...permissionConfig}>
        <WrappedComponent {...props} />
      </PermissionGuard>
    );
  };
};

/**
 * Hook for conditional rendering based on permissions
 * @param {string|string[]} permission - Permission(s) to check
 * @param {boolean} requireAll - Whether to require all permissions
 * @returns {boolean} - Whether the user has the required permissions
 */
export const usePermissionCheck = (permission, requireAll = false) => {
  const { can, canAny, canAll, loading } = usePermissions();

  if (loading) return false;

  if (Array.isArray(permission)) {
    return requireAll ? canAll(permission) : canAny(permission);
  } else {
    return can(permission);
  }
};

/**
 * Hook for checking operation permissions
 * @param {string} operation - Operation to check
 * @param {string} module - Module to check
 * @returns {boolean} - Whether the user can perform the operation
 */
export const useOperationCheck = (operation, module) => {
  const { canPerform, loading } = usePermissions();

  if (loading) return false;
  return canPerform(operation, module);
};
