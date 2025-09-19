// Role-based routing configuration
export const getDashboardRoute = (role) => {
  const dashboardRoutes = {
    'accounting': '/positionpages/accounting',
    'admin': '/positionpages/admin',
    'auditor': '/positionpages/auditpage',
    'Customer Service': '/positionpages/customerservice',
    'Frontdesk': '/positionpages/frontdesk',
    'HR': '/positionpages/hrpage',
    'hr': '/positionpages/hrpage', // Lowercase variant
    'HR Manager': '/positionpages/hrpage', // Full title variant
    'Sales': '/positionpages/sales',
    'sales': '/positionpages/sales', // Lowercase variant
    'staff': '/positionpages/sales', // Default fallback
    'administrator': '/administratorpage',
    'Administrator': '/administratorpage', // Capitalized variant
    // Additional mappings for your specific needs
    'manager': '/positionpages/admin', // Map manager to admin dashboard
    'employee': '/positionpages/sales' // Map employee to sales dashboard
  };
  
  // Debug logging to help identify the issue
  console.log('🔍 Role routing debug:');
  console.log('  - Role received:', role);
  console.log('  - Role type:', typeof role);
  console.log('  - Available routes:', Object.keys(dashboardRoutes));
  console.log('  - Route found:', dashboardRoutes[role]);
  console.log('  - Final redirect path:', dashboardRoutes[role] || '/positionpages/sales');
  
  return dashboardRoutes[role] || '/positionpages/sales';
};

// HR Role definitions with permissions
export const HR_ROLES = {
  'HR Manager': {
    name: 'HR Manager',
    description: 'Full HR management access with all permissions',
    level: 3,
    permissions: 'full'
  },
  'HR': {
    name: 'HR',
    description: 'Standard HR access with most permissions',
    level: 2,
    permissions: 'standard'
  },
  'hr': {
    name: 'hr',
    description: 'Standard HR access (lowercase variant)',
    level: 2,
    permissions: 'standard'
  }
};

// Check if a role is an HR role
export const isHRRole = (role) => {
  return ['hr', 'HR', 'HR Manager'].includes(role);
};

// Get HR role level (higher number = more permissions)
export const getHRRoleLevel = (role) => {
  return HR_ROLES[role]?.level || 0;
};

// Available roles for signup
export const availableRoles = [
  { value: 'Sales', label: 'Sales' },
  { value: 'HR', label: 'HR' },
  { value: 'admin', label: 'Admin' },
  { value: 'administrator', label: 'Administrator' },
  { value: 'accounting', label: 'Accounting' },
  { value: 'auditor', label: 'Auditor' },
  { value: 'Customer Service', label: 'Customer Service' },
  { value: 'Frontdesk', label: 'Frontdesk' }
];
