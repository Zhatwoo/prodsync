// Permission system for role-based access control
export const PERMISSIONS = {
  // HR Module Permissions
  HR_VIEW: 'hr:view',
  HR_CREATE: 'hr:create',
  HR_EDIT: 'hr:edit',
  HR_DELETE: 'hr:delete',
  
  // Employee Record Permissions
  EMPLOYEE_VIEW: 'employee:view',
  EMPLOYEE_CREATE: 'employee:create',
  EMPLOYEE_EDIT: 'employee:edit',
  EMPLOYEE_DELETE: 'employee:delete',
  EMPLOYEE_EXPORT: 'employee:export',
  
  // Payroll Permissions
  PAYROLL_VIEW: 'payroll:view',
  PAYROLL_CREATE: 'payroll:create',
  PAYROLL_EDIT: 'payroll:edit',
  PAYROLL_DELETE: 'payroll:delete',
  PAYROLL_PROCESS: 'payroll:process',
  PAYROLL_REPORTS: 'payroll:reports',
  
  // Timekeeping Permissions
  TIMEKEEPING_VIEW: 'timekeeping:view',
  TIMEKEEPING_CREATE: 'timekeeping:create',
  TIMEKEEPING_EDIT: 'timekeeping:edit',
  TIMEKEEPING_DELETE: 'timekeeping:delete',
  TIMEKEEPING_APPROVE: 'timekeeping:approve',
  
  // Benefits Permissions
  BENEFITS_VIEW: 'benefits:view',
  BENEFITS_CREATE: 'benefits:create',
  BENEFITS_EDIT: 'benefits:edit',
  BENEFITS_DELETE: 'benefits:delete',
  
  // Department Management Permissions
  DEPARTMENT_VIEW: 'department:view',
  DEPARTMENT_CREATE: 'department:create',
  DEPARTMENT_EDIT: 'department:edit',
  DEPARTMENT_DELETE: 'department:delete',
  
  // Position Management Permissions
  POSITION_VIEW: 'position:view',
  POSITION_CREATE: 'position:create',
  POSITION_EDIT: 'position:edit',
  POSITION_DELETE: 'position:delete',
  
  // Reports Permissions
  REPORTS_VIEW: 'reports:view',
  REPORTS_EXPORT: 'reports:export',
  REPORTS_GENERATE: 'reports:generate'
};

// Role-based permission mapping
export const ROLE_PERMISSIONS = {
  // HR Manager - Full HR access
  'HR Manager': [
    PERMISSIONS.HR_VIEW,
    PERMISSIONS.HR_CREATE,
    PERMISSIONS.HR_EDIT,
    PERMISSIONS.HR_DELETE,
    PERMISSIONS.EMPLOYEE_VIEW,
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_EDIT,
    PERMISSIONS.EMPLOYEE_DELETE,
    PERMISSIONS.EMPLOYEE_EXPORT,
    PERMISSIONS.PAYROLL_VIEW,
    PERMISSIONS.PAYROLL_CREATE,
    PERMISSIONS.PAYROLL_EDIT,
    PERMISSIONS.PAYROLL_DELETE,
    PERMISSIONS.PAYROLL_PROCESS,
    PERMISSIONS.PAYROLL_REPORTS,
    PERMISSIONS.TIMEKEEPING_VIEW,
    PERMISSIONS.TIMEKEEPING_CREATE,
    PERMISSIONS.TIMEKEEPING_EDIT,
    PERMISSIONS.TIMEKEEPING_DELETE,
    PERMISSIONS.TIMEKEEPING_APPROVE,
    PERMISSIONS.BENEFITS_VIEW,
    PERMISSIONS.BENEFITS_CREATE,
    PERMISSIONS.BENEFITS_EDIT,
    PERMISSIONS.BENEFITS_DELETE,
    PERMISSIONS.DEPARTMENT_VIEW,
    PERMISSIONS.DEPARTMENT_CREATE,
    PERMISSIONS.DEPARTMENT_EDIT,
    PERMISSIONS.DEPARTMENT_DELETE,
    PERMISSIONS.POSITION_VIEW,
    PERMISSIONS.POSITION_CREATE,
    PERMISSIONS.POSITION_EDIT,
    PERMISSIONS.POSITION_DELETE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.REPORTS_GENERATE
  ],
  
  // HR - Standard HR access with delete permissions
  'HR': [
    PERMISSIONS.HR_VIEW,
    PERMISSIONS.HR_CREATE,
    PERMISSIONS.HR_EDIT,
    PERMISSIONS.HR_DELETE,
    PERMISSIONS.EMPLOYEE_VIEW,
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_EDIT,
    PERMISSIONS.EMPLOYEE_DELETE,
    PERMISSIONS.EMPLOYEE_EXPORT,
    PERMISSIONS.PAYROLL_VIEW,
    PERMISSIONS.PAYROLL_CREATE,
    PERMISSIONS.PAYROLL_EDIT,
    PERMISSIONS.PAYROLL_PROCESS,
    PERMISSIONS.PAYROLL_REPORTS,
    PERMISSIONS.TIMEKEEPING_VIEW,
    PERMISSIONS.TIMEKEEPING_CREATE,
    PERMISSIONS.TIMEKEEPING_EDIT,
    PERMISSIONS.TIMEKEEPING_APPROVE,
    PERMISSIONS.BENEFITS_VIEW,
    PERMISSIONS.BENEFITS_CREATE,
    PERMISSIONS.BENEFITS_EDIT,
    PERMISSIONS.DEPARTMENT_VIEW,
    PERMISSIONS.DEPARTMENT_CREATE,
    PERMISSIONS.DEPARTMENT_EDIT,
    PERMISSIONS.POSITION_VIEW,
    PERMISSIONS.POSITION_CREATE,
    PERMISSIONS.POSITION_EDIT,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.REPORTS_GENERATE
  ],
  
  // hr (lowercase) - Same as HR
  'hr': [
    PERMISSIONS.HR_VIEW,
    PERMISSIONS.HR_CREATE,
    PERMISSIONS.HR_EDIT,
    PERMISSIONS.HR_DELETE,
    PERMISSIONS.EMPLOYEE_VIEW,
    PERMISSIONS.EMPLOYEE_CREATE,
    PERMISSIONS.EMPLOYEE_EDIT,
    PERMISSIONS.EMPLOYEE_DELETE,
    PERMISSIONS.EMPLOYEE_EXPORT,
    PERMISSIONS.PAYROLL_VIEW,
    PERMISSIONS.PAYROLL_CREATE,
    PERMISSIONS.PAYROLL_EDIT,
    PERMISSIONS.PAYROLL_PROCESS,
    PERMISSIONS.PAYROLL_REPORTS,
    PERMISSIONS.TIMEKEEPING_VIEW,
    PERMISSIONS.TIMEKEEPING_CREATE,
    PERMISSIONS.TIMEKEEPING_EDIT,
    PERMISSIONS.TIMEKEEPING_APPROVE,
    PERMISSIONS.BENEFITS_VIEW,
    PERMISSIONS.BENEFITS_CREATE,
    PERMISSIONS.BENEFITS_EDIT,
    PERMISSIONS.DEPARTMENT_VIEW,
    PERMISSIONS.DEPARTMENT_CREATE,
    PERMISSIONS.DEPARTMENT_EDIT,
    PERMISSIONS.POSITION_VIEW,
    PERMISSIONS.POSITION_CREATE,
    PERMISSIONS.POSITION_EDIT,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.REPORTS_GENERATE
  ],
  
  // Administrator - Full access to everything
  'administrator': [
    ...Object.values(PERMISSIONS)
  ],
  
  // Administrator (capitalized) - Full access to everything
  'Administrator': [
    ...Object.values(PERMISSIONS)
  ],
  
  // Admin - Full access to everything
  'admin': [
    ...Object.values(PERMISSIONS)
  ]
};

/**
 * Check if a user with a given role has a specific permission
 * @param {string} role - The user's role
 * @param {string} permission - The permission to check
 * @returns {boolean} - Whether the user has the permission
 */
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  
  const rolePermissions = ROLE_PERMISSIONS[role] || [];
  return rolePermissions.includes(permission);
};

/**
 * Check if a user has any of the specified permissions
 * @param {string} role - The user's role
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean} - Whether the user has any of the permissions
 */
export const hasAnyPermission = (role, permissions) => {
  if (!role || !permissions || permissions.length === 0) return false;
  
  return permissions.some(permission => hasPermission(role, permission));
};

/**
 * Check if a user has all of the specified permissions
 * @param {string} role - The user's role
 * @param {string[]} permissions - Array of permissions to check
 * @returns {boolean} - Whether the user has all of the permissions
 */
export const hasAllPermissions = (role, permissions) => {
  if (!role || !permissions || permissions.length === 0) return false;
  
  return permissions.every(permission => hasPermission(role, permission));
};

/**
 * Get all permissions for a given role
 * @param {string} role - The user's role
 * @returns {string[]} - Array of permissions for the role
 */
export const getRolePermissions = (role) => {
  if (!role) return [];
  
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Check if a role can perform CRUD operations on HR data
 * @param {string} role - The user's role
 * @param {string} operation - The operation (view, create, edit, delete)
 * @param {string} module - The module (employee, payroll, timekeeping, benefits, department, position)
 * @returns {boolean} - Whether the user can perform the operation
 */
export const canPerformOperation = (role, operation, module) => {
  if (!role || !operation || !module) return false;
  
  const permission = `${module}:${operation}`;
  return hasPermission(role, permission);
};

/**
 * Get user-friendly permission descriptions
 */
export const PERMISSION_DESCRIPTIONS = {
  [PERMISSIONS.HR_VIEW]: 'View HR dashboard and overview',
  [PERMISSIONS.HR_CREATE]: 'Create new HR records',
  [PERMISSIONS.HR_EDIT]: 'Edit existing HR records',
  [PERMISSIONS.HR_DELETE]: 'Delete HR records',
  
  [PERMISSIONS.EMPLOYEE_VIEW]: 'View employee information',
  [PERMISSIONS.EMPLOYEE_CREATE]: 'Add new employees',
  [PERMISSIONS.EMPLOYEE_EDIT]: 'Edit employee information',
  [PERMISSIONS.EMPLOYEE_DELETE]: 'Delete employee records',
  [PERMISSIONS.EMPLOYEE_EXPORT]: 'Export employee data',
  
  [PERMISSIONS.PAYROLL_VIEW]: 'View payroll information',
  [PERMISSIONS.PAYROLL_CREATE]: 'Create payroll records',
  [PERMISSIONS.PAYROLL_EDIT]: 'Edit payroll information',
  [PERMISSIONS.PAYROLL_DELETE]: 'Delete payroll records',
  [PERMISSIONS.PAYROLL_PROCESS]: 'Process payroll',
  [PERMISSIONS.PAYROLL_REPORTS]: 'Generate payroll reports',
  
  [PERMISSIONS.TIMEKEEPING_VIEW]: 'View timekeeping data',
  [PERMISSIONS.TIMEKEEPING_CREATE]: 'Create timekeeping records',
  [PERMISSIONS.TIMEKEEPING_EDIT]: 'Edit timekeeping data',
  [PERMISSIONS.TIMEKEEPING_DELETE]: 'Delete timekeeping records',
  [PERMISSIONS.TIMEKEEPING_APPROVE]: 'Approve timekeeping requests',
  
  [PERMISSIONS.BENEFITS_VIEW]: 'View benefits information',
  [PERMISSIONS.BENEFITS_CREATE]: 'Create benefits records',
  [PERMISSIONS.BENEFITS_EDIT]: 'Edit benefits information',
  [PERMISSIONS.BENEFITS_DELETE]: 'Delete benefits records',
  
  [PERMISSIONS.DEPARTMENT_VIEW]: 'View department information',
  [PERMISSIONS.DEPARTMENT_CREATE]: 'Create new departments',
  [PERMISSIONS.DEPARTMENT_EDIT]: 'Edit department information',
  [PERMISSIONS.DEPARTMENT_DELETE]: 'Delete departments',
  
  [PERMISSIONS.POSITION_VIEW]: 'View position information',
  [PERMISSIONS.POSITION_CREATE]: 'Create new positions',
  [PERMISSIONS.POSITION_EDIT]: 'Edit position information',
  [PERMISSIONS.POSITION_DELETE]: 'Delete positions',
  
  [PERMISSIONS.REPORTS_VIEW]: 'View reports',
  [PERMISSIONS.REPORTS_EXPORT]: 'Export reports',
  [PERMISSIONS.REPORTS_GENERATE]: 'Generate new reports'
};
