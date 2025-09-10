# 🔐 Role-Based Access Control System

Complete role-based access control system with 8 distinct roles, dynamic sidebar menu, and role switching capabilities for testing.

## 📋 System Overview

This system implements a comprehensive role-based access control (RBAC) system with:
- **8 distinct roles** with hierarchical permissions
- **Dynamic sidebar menu** that shows/hides based on user role
- **RoleGuard components** for protecting UI elements
- **Role switching interface** for testing different user scenarios
- **Mock user data** for all roles

## 👥 Available Roles

### 1. **Administrator** (`admin`)
- **Level**: 8 (Highest)
- **Permissions**: Full system access
- **Access**: All menu items and features
- **Mock User**: Sarah Johnson (admin@prodsync.com)

### 2. **Human Resources** (`hr`)
- **Level**: 7
- **Permissions**: HR management, employee directory, payroll, reports
- **Access**: HR Management, Employee Directory, Payroll, Reports, Settings
- **Mock User**: Michael Chen (hr@prodsync.com)

### 3. **Auditor** (`auditor`)
- **Level**: 6
- **Permissions**: Audit access to all departments
- **Access**: All menu items (read-only access for auditing)
- **Mock User**: Robert Martinez (auditor@prodsync.com)

### 4. **Accountant** (`accountant`)
- **Level**: 5
- **Permissions**: Financial management and accounting
- **Access**: Accounting, Payroll, Reports, Dashboard, Settings
- **Mock User**: David Kim (accountant@prodsync.com)

### 5. **Sales Agent** (`salesagent`)
- **Level**: 4
- **Permissions**: Sales management and lead handling
- **Access**: Sales, Lead Management, Dashboard, Settings
- **Mock User**: James Wilson (sales@prodsync.com)

### 6. **Telemarketer** (`telemarketer`)
- **Level**: 3
- **Permissions**: Lead generation and telemarketing
- **Access**: Lead Management, Dashboard, Settings
- **Mock User**: Amanda Foster (telemarketer@prodsync.com)

### 7. **Front Desk** (`frontdesk`)
- **Level**: 2
- **Permissions**: Reception and customer service
- **Access**: Reception, Dashboard, Settings
- **Mock User**: Lisa Thompson (frontdesk@prodsync.com)

### 8. **Employee** (`employee`)
- **Level**: 1 (Basic)
- **Permissions**: Basic employee access
- **Access**: Dashboard, Settings
- **Mock User**: Emily Rodriguez (employee@prodsync.com)

## 🏗️ File Structure

```
src/
├── lib/
│   ├── roles.js              # Role definitions and permissions
│   └── mockUsers.js          # Mock user data for all roles
├── components/
│   ├── RoleGuard.jsx         # Role-based access control components
│   └── Sidebar.jsx           # Dynamic sidebar with role-based menu
├── app/
│   ├── role-toggle/
│   │   └── page.js           # Role switching interface
│   └── dashboard/
│       └── page.js           # Updated dashboard with sidebar
└── contexts/
    └── AuthContext.js        # Updated with role switching
```

## 🛡️ RoleGuard Component Usage

### Basic Role Protection
```jsx
import RoleGuard from '../components/RoleGuard';
import { ROLES } from '../lib/roles';

// Protect content for specific roles
<RoleGuard roles={[ROLES.ADMIN, ROLES.HR]}>
  <AdminPanel />
</RoleGuard>

// Protect content for minimum role level
<RoleGuard minimumRole={ROLES.HR}>
  <ManagerContent />
</RoleGuard>
```

### Pre-built Role Guards
```jsx
import { AdminGuard, HRGuard, SalesGuard, FinanceGuard } from '../components/RoleGuard';

// Admin only
<AdminGuard>
  <AdminOnlyContent />
</AdminGuard>

// HR and Admin
<HRGuard>
  <HRContent />
</HRGuard>

// Sales team
<SalesGuard>
  <SalesContent />
</SalesGuard>

// Finance team
<FinanceGuard>
  <FinanceContent />
</FinanceGuard>
```

### Using the Hook
```jsx
import { useRoleAccess } from '../components/RoleGuard';

function MyComponent() {
  const { hasAccess, user } = useRoleAccess([ROLES.ADMIN, ROLES.HR]);
  
  if (!hasAccess) {
    return <div>Access denied</div>;
  }
  
  return <div>Protected content</div>;
}
```

### Higher-Order Component
```jsx
import { withRoleGuard } from '../components/RoleGuard';

function AdminPage() {
  return <div>Admin content</div>;
}

export default withRoleGuard(AdminPage, { 
  roles: ROLES.ADMIN,
  fallback: <div>Access denied</div>
});
```

## 🎛️ Sidebar Menu System

The sidebar automatically shows/hides menu items based on user role:

### Menu Items by Role
- **Dashboard**: All roles
- **Admin Panel**: Admin only
- **HR Management**: Admin, HR
- **Employee Directory**: Admin, HR, Auditor
- **Payroll**: Admin, HR, Accountant, Auditor
- **Accounting**: Admin, Accountant, Auditor
- **Sales**: Admin, Sales Agent, Auditor
- **Lead Management**: Admin, Sales Agent, Telemarketer, Auditor
- **Reception**: Admin, Front Desk, Auditor
- **Reports**: Admin, HR, Accountant, Auditor
- **Settings**: All roles

### Dynamic Menu Generation
```jsx
import { getMenuItemsForRole } from '../lib/roles';

const menuItems = getMenuItemsForRole(user.role);
// Returns filtered menu items based on user's role
```

## 🔄 Role Switching for Testing

### Access Role Toggle
1. Sign in as an admin user
2. Navigate to `/role-toggle`
3. Select any role from the grid
4. Click "Switch to [Role]"
5. Observe menu changes and access restrictions

### Programmatic Role Switching
```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { switchRole } = useAuth();
  
  const handleRoleSwitch = async () => {
    const result = await switchRole(ROLES.HR);
    if (result.success) {
      console.log('Role switched successfully');
    }
  };
  
  return <button onClick={handleRoleSwitch}>Switch to HR</button>;
}
```

## 🧪 Testing Scenarios

### 1. **Admin Testing**
- **Login**: admin@prodsync.com / admin123
- **Expected**: All menu items visible
- **Test**: Access all pages and features

### 2. **HR Testing**
- **Login**: hr@prodsync.com / hr123
- **Expected**: HR, Employee Directory, Payroll, Reports visible
- **Test**: Try accessing admin-only pages (should be blocked)

### 3. **Employee Testing**
- **Login**: employee@prodsync.com / emp123
- **Expected**: Only Dashboard and Settings visible
- **Test**: Try accessing restricted pages

### 4. **Role Switching Testing**
- **Login**: As admin
- **Action**: Switch to different roles via `/role-toggle`
- **Test**: Observe menu changes and access restrictions

## 📊 Mock User Data

Each role has a complete mock user with:
- **Personal Info**: Name, email, avatar
- **Role Data**: Role, department, permissions
- **Activity Data**: Last login, company info
- **Permissions Array**: List of allowed actions

### Sample User Structure
```javascript
{
  id: '1',
  email: 'admin@prodsync.com',
  password: 'admin123',
  name: 'Sarah Johnson',
  role: 'admin',
  company: 'ProdSync Corp',
  department: 'Executive',
  avatar: 'SJ',
  lastLogin: '2024-01-15T10:30:00Z',
  permissions: ['all']
}
```

## 🎨 UI Components

### Role Badge
```jsx
import { getRoleColor, getRoleDisplayName } from '../lib/roles';

<span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
  {getRoleDisplayName(user.role)}
</span>
```

### Role Hierarchy Display
```jsx
import { ROLE_DISPLAY_NAMES, ROLE_COLORS } from '../lib/roles';

{Object.entries(ROLE_DISPLAY_NAMES).map(([role, name]) => (
  <div key={role} className="flex items-center space-x-2">
    <span className={`px-2 py-1 rounded-full text-xs ${ROLE_COLORS[role]}`}>
      {name}
    </span>
  </div>
))}
```

## 🔧 Helper Functions

### Role Checking
```javascript
import { hasRole, hasMinimumRole } from '../lib/roles';

// Check if user has specific role
const isAdmin = hasRole(user.role, ROLES.ADMIN);

// Check if user has minimum role level
const isManager = hasMinimumRole(user.role, ROLES.HR);
```

### Menu Filtering
```javascript
import { getMenuItemsForRole } from '../lib/roles';

// Get menu items for specific role
const userMenuItems = getMenuItemsForRole(user.role);
```

### Role Utilities
```javascript
import { getRoleDisplayName, getRoleColor } from '../lib/roles';

// Get human-readable role name
const displayName = getRoleDisplayName('admin'); // "Administrator"

// Get role color classes
const colorClasses = getRoleColor('hr'); // "bg-purple-100 text-purple-800"
```

## 🚀 Getting Started

### 1. **Test with Admin User**
```bash
# Sign in with admin credentials
Email: admin@prodsync.com
Password: admin123
```

### 2. **Explore Role Switching**
- Navigate to `/role-toggle`
- Try switching to different roles
- Observe menu changes

### 3. **Test Role Guards**
- Try accessing `/admin` as different roles
- Check which components show/hide

### 4. **Test Sidebar Menu**
- Switch roles and observe menu changes
- Verify only appropriate items are visible

## 🔒 Security Considerations

### Development vs Production

**Current Implementation (Development)**:
- Role switching available to all users
- Mock data for testing
- Client-side role validation

**Production Recommendations**:
- Server-side role validation
- Remove role switching in production
- Implement proper JWT with role claims
- Add audit logging for role changes
- Implement role-based API endpoints

### Best Practices
1. **Always validate roles server-side**
2. **Use RoleGuard components consistently**
3. **Test all role combinations**
4. **Implement proper error handling**
5. **Add audit trails for sensitive operations**

## 📝 Customization

### Adding New Roles
1. Add role to `ROLES` object in `src/lib/roles.js`
2. Add to `ROLE_HIERARCHY` with appropriate level
3. Add display name to `ROLE_DISPLAY_NAMES`
4. Add color to `ROLE_COLORS`
5. Create mock user in `src/lib/mockUsers.js`
6. Update menu permissions in `MENU_ITEMS`

### Adding New Menu Items
1. Add item to `MENU_ITEMS` array in `src/lib/roles.js`
2. Specify which roles can access it
3. Add icon and path information

### Customizing Permissions
1. Update `MENU_ITEMS` role arrays
2. Modify `RoleGuard` components
3. Update helper functions as needed

---

*This role-based system provides a solid foundation for implementing complex access control in your application. Customize the roles, permissions, and UI components to match your specific requirements.*
