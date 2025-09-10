'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES, ROLE_DISPLAY_NAMES, ROLE_COLORS } from '../../lib/roles';
import { MOCK_USERS, switchUserRole } from '../../lib/mockUsers';
import ProtectedRoute from '../../components/ProtectedRoute';
import Link from 'next/link';

function RoleToggleContent() {
  const { user, setUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState(user?.role || ROLES.EMPLOYEE);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleRoleSwitch = async (newRole) => {
    setIsSwitching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser = switchUserRole(user, newRole);
    setUser(newUser);
    
    // Update localStorage
    localStorage.setItem('user_data', JSON.stringify(newUser));
    
    setIsSwitching(false);
    
    // Show success message
    alert(`Role switched to ${ROLE_DISPLAY_NAMES[newRole]}!`);
  };

  const roleOptions = Object.values(ROLES).map(role => ({
    value: role,
    label: ROLE_DISPLAY_NAMES[role],
    color: ROLE_COLORS[role],
    user: MOCK_USERS.find(u => u.role === role)
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Role Toggle</h1>
              <p className="text-slate-600 mt-1">
                Switch between different user roles for testing purposes
              </p>
            </div>
            <Link
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Current User Info */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Current User</h2>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{user?.name}</h3>
              <p className="text-slate-600">{user?.email}</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${ROLE_COLORS[user?.role]}`}>
                {ROLE_DISPLAY_NAMES[user?.role]}
              </span>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Available Roles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleOptions.map((role) => (
              <div
                key={role.value}
                className={`
                  border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                  ${selectedRole === role.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }
                `}
                onClick={() => setSelectedRole(role.value)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${role.color}`}>
                    {role.label}
                  </span>
                  {selectedRole === role.value && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                      <span className="text-slate-600 text-sm font-medium">
                        {role.user?.avatar}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{role.user?.name}</p>
                      <p className="text-xs text-slate-500">{role.user?.department}</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-600">
                    <p><strong>Permissions:</strong> {role.user?.permissions?.join(', ')}</p>
                    <p><strong>Last Login:</strong> {new Date(role.user?.lastLogin).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Switch Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => handleRoleSwitch(selectedRole)}
              disabled={isSwitching || selectedRole === user?.role}
              className={`
                px-8 py-3 rounded-lg font-medium transition-colors
                ${isSwitching || selectedRole === user?.role
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
              `}
            >
              {isSwitching ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Switching...
                </div>
              ) : (
                `Switch to ${ROLE_DISPLAY_NAMES[selectedRole]}`
              )}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Testing Instructions</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>1. Role Switching:</strong> Select a role above and click "Switch to [Role]" to change your current role.</p>
            <p><strong>2. Menu Visibility:</strong> After switching, check the sidebar menu to see which items are visible for your new role.</p>
            <p><strong>3. Page Access:</strong> Try accessing different pages to test role-based access control.</p>
            <p><strong>4. Component Guards:</strong> Some components will show/hide based on your role permissions.</p>
            <p><strong>5. Reset:</strong> Refresh the page or sign out/in to return to your original role.</p>
          </div>
        </div>

        {/* Role Hierarchy */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Role Hierarchy</h3>
          <div className="space-y-2">
            {Object.entries(ROLE_DISPLAY_NAMES).map(([role, name], index) => (
              <div key={role} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-slate-600">{index + 1}</span>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${ROLE_COLORS[role]}`}>
                  {name}
                </span>
                <span className="text-sm text-slate-500">
                  {index === 0 ? 'Highest permissions' : index === Object.keys(ROLE_DISPLAY_NAMES).length - 1 ? 'Basic permissions' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoleTogglePage() {
  return (
    <ProtectedRoute>
      <RoleToggleContent />
    </ProtectedRoute>
  );
}
