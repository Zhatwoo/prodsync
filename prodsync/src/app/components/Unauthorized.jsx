"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { availableRoles, getDashboardRoute } from '../lib/roleRoutes';

const Unauthorized = ({ message, showRoleInfo = true }) => {
  const router = useRouter();
  const { user, role } = useAuth();

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    if (role) {
      const dashboardRoute = getDashboardRoute(role);
      router.push(dashboardRoute);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message || "You don't have the required permissions to access this page. Please contact your administrator if you believe this is an error."}
        </p>

        {/* Role Information */}
        {showRoleInfo && user && role && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-blue-800">
              <p className="font-medium">Current User Information:</p>
              <p>Email: {user.email}</p>
              <p>Role: <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs font-medium">{role}</span></p>
            </div>
          </div>
        )}

        {/* Available Roles Information */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-2">Available Roles in the System:</p>
            <div className="flex flex-wrap gap-2">
              {availableRoles.map((roleOption) => (
                <span 
                  key={roleOption.value} 
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    role === roleOption.value 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {roleOption.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Error Code */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-center">
            <span className="text-red-600 font-mono text-sm">
              Error Code: 403 - Forbidden
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Go Back
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            {role ? `Go to ${role} Dashboard` : 'Go to Dashboard'}
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Contact your system administrator or check your role permissions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
