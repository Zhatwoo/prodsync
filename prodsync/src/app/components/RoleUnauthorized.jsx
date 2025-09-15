"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { availableRoles, getDashboardRoute } from '../lib/roleRoutes';

const RoleUnauthorized = ({ requiredRoles = [], currentPage = "this page" }) => {
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

  const handleContactAdmin = () => {
    // You can implement contact admin functionality here
    // For now, we'll just show an alert
    alert('Please contact your system administrator to request access to this page.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Insufficient Permissions
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          You don't have the required role to access {currentPage}.
        </p>

        {/* Required Roles */}
        {requiredRoles.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-2">Required Roles for {currentPage}:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {requiredRoles.map((requiredRole, index) => {
                  const roleInfo = availableRoles.find(r => r.value === requiredRole);
                  return (
                    <span key={index} className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                      {roleInfo ? roleInfo.label : requiredRole}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Current User Info */}
        {user && role && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Your Current Access:</p>
              <p>Email: {user.email}</p>
              <p>Role: <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs font-medium">{role}</span></p>
              <p className="mt-2">Dashboard: <span className="text-blue-600 font-medium">{getDashboardRoute(role)}</span></p>
            </div>
          </div>
        )}

        {/* Available Roles Information */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-2">All Available Roles in the System:</p>
            <div className="grid grid-cols-2 gap-2">
              {availableRoles.map((roleOption) => (
                <div 
                  key={roleOption.value} 
                  className={`p-2 rounded text-xs ${
                    role === roleOption.value 
                      ? 'bg-green-100 text-green-800 border border-green-300' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="font-medium">{roleOption.label}</div>
                  <div className="text-xs opacity-75">{getDashboardRoute(roleOption.value)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleContactAdmin}
            className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            Request Access
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Go Back
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {role ? `Go to ${role} Dashboard` : 'Go to Dashboard'}
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If you believe you should have access to this page, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleUnauthorized;
