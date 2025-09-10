import { ROLES } from './roles';

// Mock users for all roles
export const MOCK_USERS = [
  // Admin
  {
    id: '1',
    email: 'admin@prodsync.com',
    password: 'admin123',
    name: 'Sarah Johnson',
    role: ROLES.ADMIN,
    company: 'ProdSync Corp',
    department: 'Executive',
    avatar: 'SJ',
    lastLogin: '2024-01-15T10:30:00Z',
    permissions: ['all']
  },
  
  // HR
  {
    id: '2',
    email: 'hr@prodsync.com',
    password: 'hr123',
    name: 'Michael Chen',
    role: ROLES.HR,
    company: 'ProdSync Corp',
    department: 'Human Resources',
    avatar: 'MC',
    lastLogin: '2024-01-15T09:15:00Z',
    permissions: ['hr_management', 'employee_directory', 'payroll', 'reports']
  },
  
  // Employee
  {
    id: '3',
    email: 'employee@prodsync.com',
    password: 'emp123',
    name: 'Emily Rodriguez',
    role: ROLES.EMPLOYEE,
    company: 'ProdSync Corp',
    department: 'Operations',
    avatar: 'ER',
    lastLogin: '2024-01-15T08:45:00Z',
    permissions: ['dashboard', 'settings']
  },
  
  // Accountant
  {
    id: '4',
    email: 'accountant@prodsync.com',
    password: 'acc123',
    name: 'David Kim',
    role: ROLES.ACCOUNTANT,
    company: 'ProdSync Corp',
    department: 'Finance',
    avatar: 'DK',
    lastLogin: '2024-01-15T11:20:00Z',
    permissions: ['accounting', 'payroll', 'reports', 'dashboard']
  },
  
  // Front Desk
  {
    id: '5',
    email: 'frontdesk@prodsync.com',
    password: 'fd123',
    name: 'Lisa Thompson',
    role: ROLES.FRONT_DESK,
    company: 'ProdSync Corp',
    department: 'Reception',
    avatar: 'LT',
    lastLogin: '2024-01-15T07:30:00Z',
    permissions: ['reception', 'dashboard', 'settings']
  },
  
  // Sales Agent
  {
    id: '6',
    email: 'sales@prodsync.com',
    password: 'sales123',
    name: 'James Wilson',
    role: ROLES.SALES_AGENT,
    company: 'ProdSync Corp',
    department: 'Sales',
    avatar: 'JW',
    lastLogin: '2024-01-15T12:00:00Z',
    permissions: ['sales', 'leads', 'dashboard', 'settings']
  },
  
  // Telemarketer
  {
    id: '7',
    email: 'telemarketer@prodsync.com',
    password: 'tm123',
    name: 'Amanda Foster',
    role: ROLES.TELEMARKETER,
    company: 'ProdSync Corp',
    department: 'Sales',
    avatar: 'AF',
    lastLogin: '2024-01-15T13:15:00Z',
    permissions: ['leads', 'dashboard', 'settings']
  },
  
  // Auditor
  {
    id: '8',
    email: 'auditor@prodsync.com',
    password: 'audit123',
    name: 'Robert Martinez',
    role: ROLES.AUDITOR,
    company: 'ProdSync Corp',
    department: 'Compliance',
    avatar: 'RM',
    lastLogin: '2024-01-15T14:30:00Z',
    permissions: ['audit', 'reports', 'employee_directory', 'payroll', 'accounting', 'sales', 'leads', 'reception', 'dashboard']
  }
];

// Helper function to get user by role
export const getUserByRole = (role) => {
  return MOCK_USERS.find(user => user.role === role);
};

// Helper function to get all users by department
export const getUsersByDepartment = (department) => {
  return MOCK_USERS.filter(user => user.department === department);
};

// Helper function to get user statistics
export const getUserStats = () => {
  const stats = {
    total: MOCK_USERS.length,
    byRole: {},
    byDepartment: {},
    activeToday: 0
  };

  MOCK_USERS.forEach(user => {
    // Count by role
    stats.byRole[user.role] = (stats.byRole[user.role] || 0) + 1;
    
    // Count by department
    stats.byDepartment[user.department] = (stats.byDepartment[user.department] || 0) + 1;
    
    // Count active today (mock: all users are active)
    stats.activeToday++;
  });

  return stats;
};

// Sample data for testing different scenarios
export const SAMPLE_SCENARIOS = {
  // High-privilege user
  admin: {
    user: getUserByRole(ROLES.ADMIN),
    description: 'Full system access with all permissions'
  },
  
  // Department head
  hr: {
    user: getUserByRole(ROLES.HR),
    description: 'Human resources management with employee oversight'
  },
  
  // Regular employee
  employee: {
    user: getUserByRole(ROLES.EMPLOYEE),
    description: 'Basic employee access with limited permissions'
  },
  
  // Financial role
  accountant: {
    user: getUserByRole(ROLES.ACCOUNTANT),
    description: 'Financial management and accounting access'
  },
  
  // Customer-facing role
  frontdesk: {
    user: getUserByRole(ROLES.FRONT_DESK),
    description: 'Reception and customer service access'
  },
  
  // Sales role
  salesagent: {
    user: getUserByRole(ROLES.SALES_AGENT),
    description: 'Sales management and lead handling'
  },
  
  // Marketing role
  telemarketer: {
    user: getUserByRole(ROLES.TELEMARKETER),
    description: 'Lead generation and telemarketing access'
  },
  
  // Compliance role
  auditor: {
    user: getUserByRole(ROLES.AUDITOR),
    description: 'Audit and compliance monitoring access'
  }
};

// Role switching helper for testing
export const switchUserRole = (currentUser, newRole) => {
  const newUser = getUserByRole(newRole);
  if (newUser) {
    return {
      ...newUser,
      // Preserve some current user data
      email: currentUser.email,
      company: currentUser.company
    };
  }
  return currentUser;
};
