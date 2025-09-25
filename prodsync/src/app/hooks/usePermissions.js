'use client';

import { useAuth } from '../context/AuthContext';
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions, 
  getRolePermissions,
  canPerformOperation,
  PERMISSIONS 
} from '../lib/permissions';

/**
 * Custom hook for permission checking
 * @returns {object} Permission checking functions and current user info
 */
export const usePermissions = () => {
  const { user, role, loading } = useAuth();

  /**
   * Check if current user has a specific permission
   * @param {string} permission - The permission to check
   * @returns {boolean} - Whether the user has the permission
   */
  const can = (permission) => {
    if (loading || !role) return false;
    return hasPermission(role, permission);
  };

  /**
   * Check if current user has any of the specified permissions
   * @param {string[]} permissions - Array of permissions to check
   * @returns {boolean} - Whether the user has any of the permissions
   */
  const canAny = (permissions) => {
    if (loading || !role || !permissions) return false;
    return hasAnyPermission(role, permissions);
  };

  /**
   * Check if current user has all of the specified permissions
   * @param {string[]} permissions - Array of permissions to check
   * @returns {boolean} - Whether the user has all of the permissions
   */
  const canAll = (permissions) => {
    if (loading || !role || !permissions) return false;
    return hasAllPermissions(role, permissions);
  };

  /**
   * Check if current user can perform a specific operation on a module
   * @param {string} operation - The operation (view, create, edit, delete)
   * @param {string} module - The module (employee, payroll, timekeeping, benefits, department, position)
   * @returns {boolean} - Whether the user can perform the operation
   */
  const canPerform = (operation, module) => {
    if (loading || !role) return false;
    return canPerformOperation(role, operation, module);
  };

  /**
   * Get all permissions for the current user's role
   * @returns {string[]} - Array of permissions
   */
  const getPermissions = () => {
    if (loading || !role) return [];
    return getRolePermissions(role);
  };

  /**
   * Check if current user is an HR user (any HR role)
   * @returns {boolean} - Whether the user is an HR user
   */
  const isHR = () => {
    if (loading || !role) return false;
    return ['hr', 'HR', 'HR Manager'].includes(role);
  };

  /**
   * Check if current user is an administrator
   * @returns {boolean} - Whether the user is an administrator
   */
  const isAdmin = () => {
    if (loading || !role) return false;
    return ['admin', 'administrator', 'Administrator'].includes(role);
  };

  /**
   * Check if current user has HR management permissions
   * @returns {boolean} - Whether the user can manage HR data
   */
  const canManageHR = () => {
    if (loading || !role) return false;
    return canAny([
      PERMISSIONS.HR_VIEW,
      PERMISSIONS.EMPLOYEE_VIEW,
      PERMISSIONS.PAYROLL_VIEW,
      PERMISSIONS.TIMEKEEPING_VIEW,
      PERMISSIONS.BENEFITS_VIEW
    ]);
  };

  /**
   * Check if current user can manage employees
   * @returns {boolean} - Whether the user can manage employees
   */
  const canManageEmployees = () => {
    if (loading || !role) return false;
    return canAny([
      PERMISSIONS.EMPLOYEE_VIEW,
      PERMISSIONS.EMPLOYEE_CREATE,
      PERMISSIONS.EMPLOYEE_EDIT,
      PERMISSIONS.EMPLOYEE_DELETE
    ]);
  };

  /**
   * Check if current user can manage payroll
   * @returns {boolean} - Whether the user can manage payroll
   */
  const canManagePayroll = () => {
    if (loading || !role) return false;
    return canAny([
      PERMISSIONS.PAYROLL_VIEW,
      PERMISSIONS.PAYROLL_CREATE,
      PERMISSIONS.PAYROLL_EDIT,
      PERMISSIONS.PAYROLL_DELETE,
      PERMISSIONS.PAYROLL_PROCESS
    ]);
  };

  /**
   * Check if current user can manage timekeeping
   * @returns {boolean} - Whether the user can manage timekeeping
   */
  const canManageTimekeeping = () => {
    if (loading || !role) return false;
    return canAny([
      PERMISSIONS.TIMEKEEPING_VIEW,
      PERMISSIONS.TIMEKEEPING_CREATE,
      PERMISSIONS.TIMEKEEPING_EDIT,
      PERMISSIONS.TIMEKEEPING_DELETE,
      PERMISSIONS.TIMEKEEPING_APPROVE
    ]);
  };

  /**
   * Check if current user can manage benefits
   * @returns {boolean} - Whether the user can manage benefits
   */
  const canManageBenefits = () => {
    if (loading || !role) return false;
    return canAny([
      PERMISSIONS.BENEFITS_VIEW,
      PERMISSIONS.BENEFITS_CREATE,
      PERMISSIONS.BENEFITS_EDIT,
      PERMISSIONS.BENEFITS_DELETE
    ]);
  };

  /**
   * Check if current user can manage departments
   * @returns {boolean} - Whether the user can manage departments
   */
  const canManageDepartments = () => {
    if (loading || !role) return false;
    return canAny([
      PERMISSIONS.DEPARTMENT_VIEW,
      PERMISSIONS.DEPARTMENT_CREATE,
      PERMISSIONS.DEPARTMENT_EDIT,
      PERMISSIONS.DEPARTMENT_DELETE
    ]);
  };

  /**
   * Check if current user can manage positions
   * @returns {boolean} - Whether the user can manage positions
   */
  const canManagePositions = () => {
    if (loading || !role) return false;
    return canAny([
      PERMISSIONS.POSITION_VIEW,
      PERMISSIONS.POSITION_CREATE,
      PERMISSIONS.POSITION_EDIT,
      PERMISSIONS.POSITION_DELETE
    ]);
  };

  /**
   * Check if current user can generate reports
   * @returns {boolean} - Whether the user can generate reports
   */
  const canGenerateReports = () => {
    if (loading || !role) return false;
    return canAny([
      PERMISSIONS.REPORTS_VIEW,
      PERMISSIONS.REPORTS_EXPORT,
      PERMISSIONS.REPORTS_GENERATE
    ]);
  };

  return {
    // User info
    user,
    role,
    loading,
    
    // Permission checking functions
    can,
    canAny,
    canAll,
    canPerform,
    getPermissions,
    
    // Role checking functions
    isHR,
    isAdmin,
    
    // Module-specific permission functions
    canManageHR,
    canManageEmployees,
    canManagePayroll,
    canManageTimekeeping,
    canManageBenefits,
    canManageDepartments,
    canManagePositions,
    canGenerateReports,
    
    // Permission constants for easy access
    PERMISSIONS
  };
};
