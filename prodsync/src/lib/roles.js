// Role definitions and permissions
export const ROLES = {
  ADMIN: 'admin',
  HR: 'hr',
  EMPLOYEE: 'employee',
  ACCOUNTANT: 'accountant',
  FRONT_DESK: 'frontdesk',
  SALES_AGENT: 'salesagent',
  TELEMARKETER: 'telemarketer',
  AUDITOR: 'auditor'
};

// Role hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 8,
  [ROLES.HR]: 7,
  [ROLES.AUDITOR]: 6,
  [ROLES.ACCOUNTANT]: 5,
  [ROLES.SALES_AGENT]: 4,
  [ROLES.TELEMARKETER]: 3,
  [ROLES.FRONT_DESK]: 2,
  [ROLES.EMPLOYEE]: 1
};

// Role display names
export const ROLE_DISPLAY_NAMES = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.HR]: 'Human Resources',
  [ROLES.EMPLOYEE]: 'Employee',
  [ROLES.ACCOUNTANT]: 'Accountant',
  [ROLES.FRONT_DESK]: 'Front Desk',
  [ROLES.SALES_AGENT]: 'Sales Agent',
  [ROLES.TELEMARKETER]: 'Telemarketer',
  [ROLES.AUDITOR]: 'Auditor'
};

// Role colors for UI
export const ROLE_COLORS = {
  [ROLES.ADMIN]: 'bg-red-100 text-red-800',
  [ROLES.HR]: 'bg-purple-100 text-purple-800',
  [ROLES.EMPLOYEE]: 'bg-blue-100 text-blue-800',
  [ROLES.ACCOUNTANT]: 'bg-green-100 text-green-800',
  [ROLES.FRONT_DESK]: 'bg-yellow-100 text-yellow-800',
  [ROLES.SALES_AGENT]: 'bg-orange-100 text-orange-800',
  [ROLES.TELEMARKETER]: 'bg-pink-100 text-pink-800',
  [ROLES.AUDITOR]: 'bg-indigo-100 text-indigo-800'
};

// Menu items with role permissions
export const MENU_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z',
    path: '/dashboard',
    roles: [ROLES.ADMIN, ROLES.HR, ROLES.EMPLOYEE, ROLES.ACCOUNTANT, ROLES.FRONT_DESK, ROLES.SALES_AGENT, ROLES.TELEMARKETER, ROLES.AUDITOR]
  },
  {
    id: 'admin',
    label: 'Admin Panel',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    path: '/admin',
    roles: [ROLES.ADMIN]
  },
  {
    id: 'hr',
    label: 'HR Management',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    path: '/hr',
    roles: [ROLES.ADMIN, ROLES.HR]
  },
  {
    id: 'employees',
    label: 'Employee Directory',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    path: '/hr/employees',
    roles: [ROLES.ADMIN, ROLES.HR, ROLES.AUDITOR]
  },
  {
    id: 'payroll',
    label: 'Payroll',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
    path: '/payroll',
    roles: [ROLES.ADMIN, ROLES.HR, ROLES.ACCOUNTANT, ROLES.AUDITOR]
  },
  {
    id: 'accounting',
    label: 'Accounting',
    icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    path: '/accounting',
    roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.AUDITOR]
  },
  {
    id: 'sales',
    label: 'Sales',
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    path: '/sales',
    roles: [ROLES.ADMIN, ROLES.SALES_AGENT, ROLES.AUDITOR]
  },
  {
    id: 'leads',
    label: 'Lead Management',
    icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    path: '/leads',
    roles: [ROLES.ADMIN, ROLES.SALES_AGENT, ROLES.TELEMARKETER, ROLES.AUDITOR]
  },
  {
    id: 'telemarketing',
    label: 'Telemarketing',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    path: '/telemarketing',
    roles: [ROLES.ADMIN, ROLES.TELEMARKETER, ROLES.SALES_AGENT, ROLES.AUDITOR]
  },
  {
    id: 'reception',
    label: 'Reception',
    icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    path: '/reception',
    roles: [ROLES.ADMIN, ROLES.FRONT_DESK, ROLES.AUDITOR]
  },
  {
    id: 'visitor-log',
    label: 'Visitor Log',
    icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z',
    path: '/visitor-log',
    roles: [ROLES.ADMIN, ROLES.FRONT_DESK, ROLES.HR, ROLES.AUDITOR]
  },
  {
    id: 'timecard',
    label: 'Timecard',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    path: '/timecard',
    roles: [ROLES.ADMIN, ROLES.HR, ROLES.EMPLOYEE, ROLES.ACCOUNTANT, ROLES.FRONT_DESK, ROLES.SALES_AGENT, ROLES.TELEMARKETER, ROLES.AUDITOR]
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    path: '/reports',
    roles: [ROLES.ADMIN, ROLES.HR, ROLES.ACCOUNTANT, ROLES.AUDITOR]
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    path: '/settings',
    roles: [ROLES.ADMIN, ROLES.HR, ROLES.EMPLOYEE, ROLES.ACCOUNTANT, ROLES.FRONT_DESK, ROLES.SALES_AGENT, ROLES.TELEMARKETER, ROLES.AUDITOR]
  }
];

// Helper functions
export const hasRole = (userRole, requiredRoles) => {
  if (!userRole || !requiredRoles) return false;
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole);
  }
  return userRole === requiredRoles;
};

export const hasMinimumRole = (userRole, minimumRole) => {
  if (!userRole || !minimumRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole];
};

export const getRoleDisplayName = (role) => {
  return ROLE_DISPLAY_NAMES[role] || role;
};

export const getRoleColor = (role) => {
  return ROLE_COLORS[role] || 'bg-gray-100 text-gray-800';
};

export const getMenuItemsForRole = (role) => {
  return MENU_ITEMS.filter(item => hasRole(role, item.roles));
};
