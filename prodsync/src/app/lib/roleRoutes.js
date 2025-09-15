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
