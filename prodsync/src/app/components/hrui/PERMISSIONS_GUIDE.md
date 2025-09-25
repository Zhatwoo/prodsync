# HR Permissions System Guide

This guide explains how to use the new permission system for HR roles in the application.

## Overview

The permission system provides granular control over what HR users can view, create, edit, and delete within the HR module. It supports different HR role levels with varying permissions.

## HR Roles and Permissions

### HR Manager (Full Access)
- **Role**: `HR Manager`
- **Level**: 3 (Highest)
- **Permissions**: Full access to all HR operations including delete operations

### HR (Standard Access)
- **Role**: `HR` or `hr`
- **Level**: 2 (Standard)
- **Permissions**: Most HR operations except sensitive delete operations

### Administrator
- **Role**: `admin`, `administrator`, or `Administrator`
- **Level**: Highest
- **Permissions**: Full system access including all HR permissions

## Available Permissions

### Employee Management
- `employee:view` - View employee information
- `employee:create` - Add new employees
- `employee:edit` - Edit employee information
- `employee:delete` - Delete employee records
- `employee:export` - Export employee data

### Payroll Management
- `payroll:view` - View payroll information
- `payroll:create` - Create payroll records
- `payroll:edit` - Edit payroll information
- `payroll:delete` - Delete payroll records
- `payroll:process` - Process payroll
- `payroll:reports` - Generate payroll reports

### Timekeeping Management
- `timekeeping:view` - View timekeeping data
- `timekeeping:create` - Create timekeeping records
- `timekeeping:edit` - Edit timekeeping data
- `timekeeping:delete` - Delete timekeeping records
- `timekeeping:approve` - Approve timekeeping requests

### Benefits Management
- `benefits:view` - View benefits information
- `benefits:create` - Create benefits records
- `benefits:edit` - Edit benefits information
- `benefits:delete` - Delete benefits records

### Department Management
- `department:view` - View department information
- `department:create` - Create new departments
- `department:edit` - Edit department information
- `department:delete` - Delete departments

### Position Management
- `position:view` - View position information
- `position:create` - Create new positions
- `position:edit` - Edit position information
- `position:delete` - Delete positions

### Reports
- `reports:view` - View reports
- `reports:export` - Export reports
- `reports:generate` - Generate new reports

## How to Use the Permission System

### 1. Using the usePermissions Hook

```jsx
import { usePermissions } from '../../../hooks/usePermissions';
import { PERMISSIONS } from '../../../lib/permissions';

function MyComponent() {
  const { can, canAny, canAll, canPerform, isHR, isAdmin } = usePermissions();

  // Check single permission
  if (can(PERMISSIONS.EMPLOYEE_VIEW)) {
    // User can view employees
  }

  // Check multiple permissions (any)
  if (canAny([PERMISSIONS.EMPLOYEE_VIEW, PERMISSIONS.EMPLOYEE_CREATE])) {
    // User can view OR create employees
  }

  // Check multiple permissions (all)
  if (canAll([PERMISSIONS.EMPLOYEE_VIEW, PERMISSIONS.EMPLOYEE_EDIT])) {
    // User can view AND edit employees
  }

  // Check operation on module
  if (canPerform('view', 'employee')) {
    // User can view employee data
  }

  // Check role
  if (isHR()) {
    // User is an HR user
  }
}
```

### 2. Using PermissionGuard Component

```jsx
import PermissionGuard from '../../PermissionGuard';
import { PERMISSIONS } from '../../../lib/permissions';

function MyComponent() {
  return (
    <div>
      {/* Single permission check */}
      <PermissionGuard permission={PERMISSIONS.EMPLOYEE_VIEW}>
        <button>View Employees</button>
      </PermissionGuard>

      {/* Multiple permissions (any) */}
      <PermissionGuard 
        permission={[PERMISSIONS.EMPLOYEE_VIEW, PERMISSIONS.EMPLOYEE_CREATE]}
        requireAll={false}
      >
        <button>Employee Actions</button>
      </PermissionGuard>

      {/* Multiple permissions (all) */}
      <PermissionGuard 
        permission={[PERMISSIONS.EMPLOYEE_VIEW, PERMISSIONS.EMPLOYEE_EDIT]}
        requireAll={true}
      >
        <button>Edit Employee</button>
      </PermissionGuard>

      {/* Operation and module check */}
      <PermissionGuard operation="delete" module="employee">
        <button>Delete Employee</button>
      </PermissionGuard>

      {/* With fallback content */}
      <PermissionGuard 
        permission={PERMISSIONS.EMPLOYEE_DELETE}
        fallback={<span>No delete permission</span>}
      >
        <button>Delete Employee</button>
      </PermissionGuard>

      {/* Hide when no permission */}
      <PermissionGuard 
        permission={PERMISSIONS.EMPLOYEE_DELETE}
        hide={true}
      >
        <button>Delete Employee</button>
      </PermissionGuard>
    </div>
  );
}
```

### 3. Using Higher-Order Component

```jsx
import { withPermission } from '../../PermissionGuard';
import { PERMISSIONS } from '../../../lib/permissions';

const EmployeeList = () => {
  return <div>Employee List Component</div>;
};

// Wrap component with permission
const ProtectedEmployeeList = withPermission(EmployeeList, {
  permission: PERMISSIONS.EMPLOYEE_VIEW
});

export default ProtectedEmployeeList;
```

### 4. Using Permission Hooks

```jsx
import { usePermissionCheck, useOperationCheck } from '../../PermissionGuard';
import { PERMISSIONS } from '../../../lib/permissions';

function MyComponent() {
  // Check single permission
  const canView = usePermissionCheck(PERMISSIONS.EMPLOYEE_VIEW);
  
  // Check multiple permissions
  const canManage = usePermissionCheck([
    PERMISSIONS.EMPLOYEE_VIEW, 
    PERMISSIONS.EMPLOYEE_EDIT
  ], true); // require all

  // Check operation
  const canDelete = useOperationCheck('delete', 'employee');

  return (
    <div>
      {canView && <button>View</button>}
      {canManage && <button>Manage</button>}
      {canDelete && <button>Delete</button>}
    </div>
  );
}
```

## Examples in HR Components

### Employee List with Permissions

```jsx
// Action buttons with permission guards
<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  <div className="flex space-x-2">
    <PermissionGuard permission={PERMISSIONS.EMPLOYEE_VIEW}>
      <button onClick={() => handleViewEmployee(employee)}>
        View
      </button>
    </PermissionGuard>
    <PermissionGuard permission={PERMISSIONS.EMPLOYEE_EDIT}>
      <button onClick={() => handleEditEmployee(employee)}>
        Edit
      </button>
    </PermissionGuard>
    <PermissionGuard permission={PERMISSIONS.EMPLOYEE_DELETE}>
      <button onClick={() => handleDeleteEmployee(employee)}>
        Delete
      </button>
    </PermissionGuard>
  </div>
</td>
```

### Dashboard with Conditional Features

```jsx
// Quick actions based on permissions
<PermissionGuard permission={PERMISSIONS.EMPLOYEE_VIEW}>
  <div className="employee-actions-card">
    <PermissionGuard permission={PERMISSIONS.EMPLOYEE_CREATE}>
      <button>Add New Employee</button>
    </PermissionGuard>
    <PermissionGuard permission={PERMISSIONS.EMPLOYEE_VIEW}>
      <button>View All Employees</button>
    </PermissionGuard>
  </div>
</PermissionGuard>
```

## Best Practices

1. **Always check permissions before rendering sensitive actions**
2. **Use PermissionGuard for UI elements that should be conditionally visible**
3. **Use usePermissions hook for complex permission logic**
4. **Provide fallback content when users don't have permissions**
5. **Test with different role levels to ensure proper access control**

## Testing Permissions

To test the permission system:

1. **Create users with different HR roles**
2. **Verify that UI elements appear/disappear based on permissions**
3. **Test that protected actions are properly restricted**
4. **Ensure administrators have full access**

## Security Notes

- **Client-side permissions are for UX only**
- **Always implement server-side permission checks for API endpoints**
- **Never rely solely on client-side permission checks for security**
- **Use Firestore security rules to enforce permissions at the database level**

## Troubleshooting

### Common Issues

1. **Permission not working**: Check that the role is properly set in the user's Firestore document
2. **UI not updating**: Ensure the usePermissions hook is being used correctly
3. **PermissionGuard not rendering**: Verify the permission string matches exactly

### Debug Tips

```jsx
// Add debug logging
const { role, getPermissions } = usePermissions();
console.log('Current role:', role);
console.log('User permissions:', getPermissions());
```
