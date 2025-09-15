// Role-based routing configuration
export const getDashboardRoute = (role) => {
  const dashboardRoutes = {
    'accounting': '/positionpages/accounting',
    'admin': '/positionpages/admin',
    'auditor': '/positionpages/auditpage',
    'Customer Service': '/positionpages/customerservice',
    'Frontdesk': '/positionpages/frontdesk',
    'HR': '/positionpages/hrpage',
    'Sales': '/positionpages/sales',
    'staff': '/positionpages/sales', // Default fallback
    'administrator': '/administratorpage',
    // Additional mappings for your specific needs
    'manager': '/positionpages/admin', // Map manager to admin dashboard
    'employee': '/positionpages/sales' // Map employee to sales dashboard
  };
  
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
