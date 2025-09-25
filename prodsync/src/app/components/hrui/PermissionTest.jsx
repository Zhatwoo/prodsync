'use client';

import { usePermissions } from '../../hooks/usePermissions';
import PermissionGuard from '../PermissionGuard';
import { PERMISSIONS } from '../../lib/permissions';

/**
 * Test component to demonstrate the permission system
 * This component shows how different HR roles see different UI elements
 */
export default function PermissionTest() {
  const { 
    user, 
    role, 
    loading, 
    can, 
    canAny, 
    canAll, 
    canPerform, 
    isHR, 
    isAdmin,
    canManageEmployees,
    canManagePayroll,
    canManageTimekeeping,
    canManageBenefits,
    getPermissions
  } = usePermissions();

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">HR Permission System Test</h2>
          <p className="text-gray-600 mt-1">This component demonstrates how the permission system works</p>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Current User Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-gray-900">{user?.email || 'Not logged in'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Role:</span>
                <span className="ml-2 text-gray-900">{role || 'No role assigned'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Is HR:</span>
                <span className="ml-2 text-gray-900">{isHR() ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Is Admin:</span>
                <span className="ml-2 text-gray-900">{isAdmin() ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Permission Summary */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Permission Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Can Manage Employees:</span>
                <span className="ml-2 text-gray-900">{canManageEmployees() ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Can Manage Payroll:</span>
                <span className="ml-2 text-gray-900">{canManagePayroll() ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Can Manage Timekeeping:</span>
                <span className="ml-2 text-gray-900">{canManageTimekeeping() ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Can Manage Benefits:</span>
                <span className="ml-2 text-gray-900">{canManageBenefits() ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Employee Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <PermissionGuard permission={PERMISSIONS.EMPLOYEE_VIEW}>
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  View Employees
                </button>
              </PermissionGuard>
              
              <PermissionGuard permission={PERMISSIONS.EMPLOYEE_CREATE}>
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  Add Employee
                </button>
              </PermissionGuard>
              
              <PermissionGuard permission={PERMISSIONS.EMPLOYEE_EDIT}>
                <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors">
                  Edit Employee
                </button>
              </PermissionGuard>
              
              <PermissionGuard permission={PERMISSIONS.EMPLOYEE_DELETE}>
                <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                  Delete Employee
                </button>
              </PermissionGuard>
            </div>
          </div>

          {/* Payroll Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payroll Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <PermissionGuard permission={PERMISSIONS.PAYROLL_VIEW}>
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  View Payroll
                </button>
              </PermissionGuard>
              
              <PermissionGuard permission={PERMISSIONS.PAYROLL_PROCESS}>
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  Process Payroll
                </button>
              </PermissionGuard>
              
              <PermissionGuard permission={PERMISSIONS.PAYROLL_REPORTS}>
                <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                  Generate Reports
                </button>
              </PermissionGuard>
              
              <PermissionGuard permission={PERMISSIONS.PAYROLL_DELETE}>
                <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                  Delete Payroll
                </button>
              </PermissionGuard>
            </div>
          </div>

          {/* Timekeeping Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timekeeping Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <PermissionGuard permission={PERMISSIONS.TIMEKEEPING_VIEW}>
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  View Timekeeping
                </button>
              </PermissionGuard>
              
              <PermissionGuard permission={PERMISSIONS.TIMEKEEPING_APPROVE}>
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  Approve Requests
                </button>
              </PermissionGuard>
              
              <PermissionGuard permission={PERMISSIONS.TIMEKEEPING_EDIT}>
                <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors">
                  Edit Timekeeping
                </button>
              </PermissionGuard>
              
              <PermissionGuard permission={PERMISSIONS.TIMEKEEPING_DELETE}>
                <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                  Delete Records
                </button>
              </PermissionGuard>
            </div>
          </div>

          {/* Benefits Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <PermissionGuard permission={PERMISSIONS.BENEFITS_VIEW}>
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  View Benefits
                </button>
              </PermissionGuard>
              
              <PermissionGuard permission={PERMISSIONS.BENEFITS_CREATE}>
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  Add Benefits
                </button>
              </PermissionGuard>
              
              <PermissionGuard permission={PERMISSIONS.BENEFITS_EDIT}>
                <button className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors">
                  Edit Benefits
                </button>
              </PermissionGuard>
              
              <PermissionGuard permission={PERMISSIONS.BENEFITS_DELETE}>
                <button className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                  Delete Benefits
                </button>
              </PermissionGuard>
            </div>
          </div>

          {/* All Permissions List */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All User Permissions</h3>
            <div className="text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {getPermissions().map((permission, index) => (
                  <div key={index} className="bg-white px-3 py-1 rounded border text-gray-700">
                    {permission}
                  </div>
                ))}
              </div>
              {getPermissions().length === 0 && (
                <p className="text-gray-500 italic">No permissions assigned</p>
              )}
            </div>
          </div>

          {/* Permission Test Results */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Permission Test Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Can view employees:</span>
                <span className="ml-2 text-gray-900">{can(PERMISSIONS.EMPLOYEE_VIEW) ? '✅ Yes' : '❌ No'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Can create employees:</span>
                <span className="ml-2 text-gray-900">{can(PERMISSIONS.EMPLOYEE_CREATE) ? '✅ Yes' : '❌ No'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Can edit employees:</span>
                <span className="ml-2 text-gray-900">{can(PERMISSIONS.EMPLOYEE_EDIT) ? '✅ Yes' : '❌ No'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Can delete employees:</span>
                <span className="ml-2 text-gray-900">{can(PERMISSIONS.EMPLOYEE_DELETE) ? '✅ Yes' : '❌ No'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Can export employees:</span>
                <span className="ml-2 text-gray-900">{can(PERMISSIONS.EMPLOYEE_EXPORT) ? '✅ Yes' : '❌ No'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Can perform view on employee:</span>
                <span className="ml-2 text-gray-900">{canPerform('view', 'employee') ? '✅ Yes' : '❌ No'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
