# Unauthorized Components

This directory contains components for handling unauthorized access scenarios in the application, fully integrated with the role-based authentication system.

## Components

### 1. Unauthorized.jsx
A general unauthorized access component that displays when users don't have access to a page. Now fully integrated with the role-based system.

**Features:**
- Shows current user role and email
- Displays all available roles in the system
- Highlights the user's current role
- Smart dashboard navigation based on user role
- Role-based button text

**Props:**
- `message` (optional): Custom message to display
- `showRoleInfo` (optional, default: true): Whether to show current user role information

**Usage:**
```jsx
import Unauthorized from '../components/Unauthorized';

// Basic usage
<Unauthorized />

// With custom message
<Unauthorized message="You need administrator privileges to access this feature." />

// Without role info
<Unauthorized showRoleInfo={false} />
```

### 2. RoleUnauthorized.jsx
A more specific unauthorized component for role-based access control, fully integrated with the role system.

**Features:**
- Shows required roles with proper labels from the role system
- Displays current user role and dashboard route
- Shows all available roles with their dashboard routes
- Smart navigation to user's role-specific dashboard
- Role-based button text and navigation

**Props:**
- `requiredRoles` (optional): Array of required roles
- `currentPage` (optional, default: "this page"): Description of the page being accessed

**Usage:**
```jsx
import RoleUnauthorized from '../components/RoleUnauthorized';

// Basic usage
<RoleUnauthorized />

// With specific roles
<RoleUnauthorized 
  requiredRoles={['admin', 'administrator']} 
  currentPage="the administrator panel" 
/>
```

### 3. RequireRole.jsx (Updated)
A wrapper component that automatically shows the RoleUnauthorized component when users don't have the required role.

**Props:**
- `children`: The content to protect
- `allowed`: Array of allowed roles (default: ["admin"])

**Usage:**
```jsx
import RequireRole from '../components/RequireRole';

<RequireRole allowed={['admin', 'manager']}>
  <AdminPanel />
</RequireRole>
```

## Pages

### 1. /unauthorized
General unauthorized access page that uses the Unauthorized component.

### 2. /role-unauthorized
Role-specific unauthorized access page that uses the RoleUnauthorized component.

## Features

- **Role-Based Integration**: Fully integrated with the role-based authentication system
- **Smart Navigation**: Automatically routes users to their role-specific dashboard
- **Role Information Display**: Shows all available roles, current user role, and dashboard routes
- **Responsive Design**: All components are mobile-friendly
- **User Information Display**: Shows current user email and role when available
- **Navigation Options**: Provides buttons to go back, go to role-specific dashboard, or request access
- **Customizable Messages**: Allows custom error messages
- **Professional UI**: Clean, modern design with appropriate icons and colors
- **Dynamic Content**: Role information and navigation adapts based on user's current role

## Integration

The RequireRole component automatically handles unauthorized access by:
1. Checking if user is logged in
2. Checking if user has a role
3. Checking if user's role is in the allowed roles list
4. Showing the RoleUnauthorized component if access is denied
5. Redirecting to login if user is not authenticated

## Role-Based System Integration

The unauthorized components are now fully integrated with the role-based system:

### Available Roles:
- **Sales**: `/positionpages/sales`
- **HR**: `/positionpages/hrpage`
- **Admin**: `/positionpages/admin`
- **Administrator**: `/administratorpage`
- **Accounting**: `/positionpages/accounting`
- **Auditor**: `/positionpages/auditpage`
- **Customer Service**: `/positionpages/customerservice`
- **Frontdesk**: `/positionpages/frontdesk`

### Smart Features:
- **Dynamic Dashboard Routing**: Users are automatically directed to their role-specific dashboard
- **Role Highlighting**: Current user role is highlighted in the role list
- **Dashboard Route Display**: Shows the dashboard route for each role
- **Contextual Navigation**: Button text changes based on user's role

This provides a seamless, role-aware user experience while maintaining security and clear navigation paths.
