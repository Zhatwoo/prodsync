'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '../../lib/authUtils';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalBenefits: 0,
    complianceScore: 0,
    pendingPayables: 0,
    activePermits: 0,
    reinvestmentRequests: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [quickActions] = useState([
    {
      title: 'Benefits Management',
      description: 'Manage employee benefits and coverage',
      icon: '🎁',
      href: '/positionpages/admin/benefits',
      color: 'bg-gradient-to-r from-pink-500 to-pink-600'
    },
    {
      title: 'Government Compliance',
      description: 'Ensure regulatory compliance and reporting',
      icon: '🛡️',
      href: '/positionpages/admin/government-compliance',
      color: 'bg-gradient-to-r from-orange-500 to-orange-600'
    },
    {
      title: 'Account Payables',
      description: 'Manage vendor payments and expenses',
      icon: '💳',
      href: '/positionpages/admin/account-payables',
      color: 'bg-gradient-to-r from-teal-500 to-teal-600'
    },
    {
      title: 'Reinvestment Request',
      description: 'Handle investment and capital allocation requests',
      icon: '💰',
      href: '/positionpages/admin/reinvestment-request',
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600'
    },
    {
      title: 'Permits Management',
      description: 'Manage permits, licenses and regulatory approvals',
      icon: '📋',
      href: '/positionpages/admin/permits',
      color: 'bg-gradient-to-r from-amber-500 to-amber-600'
    }
  ]);

  const [charts] = useState([
    {
      title: 'Benefits Cost Trend',
      type: 'line',
      data: [45000, 47000, 46000, 48000, 49000, 50000],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    {
      title: 'Compliance Status',
      type: 'doughnut',
      data: [85, 10, 5],
      labels: ['Compliant', 'Pending', 'Non-Compliant']
    }
  ]);

  useEffect(() => {
    // Simulate data loading
    setStats({
      totalBenefits: 156,
      complianceScore: 95,
      pendingPayables: 12500,
      activePermits: 23,
      reinvestmentRequests: 8
    });

    setRecentActivities([
      {
        id: 1,
        action: 'Benefits enrollment updated for Q2',
        time: '1 hour ago',
        type: 'benefits',
        status: 'completed'
      },
      {
        id: 2,
        action: 'Compliance report generated',
        time: '3 hours ago',
        type: 'compliance',
        status: 'completed'
      },
      {
        id: 3,
        action: 'Vendor payment processed',
        time: '5 hours ago',
        type: 'payables',
        status: 'completed'
      },
      {
        id: 4,
        action: 'New permit application submitted',
        time: '1 day ago',
        type: 'permits',
        status: 'pending'
      },
      {
        id: 5,
        action: 'Reinvestment request approved',
        time: '2 days ago',
        type: 'reinvestment',
        status: 'completed'
      }
    ]);
  }, []);

  const getActivityIcon = (type) => {
    const icons = {
      benefits: '🎁',
      compliance: '🛡️',
      payables: '💳',
      permits: '📋',
      reinvestment: '💰'
    };
    return icons[type] || '📋';
  };

  const getActivityColor = (type) => {
    const colors = {
      benefits: 'text-pink-600 bg-pink-100',
      compliance: 'text-orange-600 bg-orange-100',
      payables: 'text-teal-600 bg-teal-100',
      permits: 'text-amber-600 bg-amber-100',
      reinvestment: 'text-indigo-600 bg-indigo-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push('/auth/login');
    } else {
      console.error('Logout failed:', result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Benefits</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBenefits}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Compliance Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.complianceScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Payables</p>
                <p className="text-2xl font-bold text-gray-900">${stats.pendingPayables.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Permits</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activePermits}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Reinvestment Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.reinvestmentRequests}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="group block p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-start">
                      <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <span className="text-2xl">{action.icon}</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 ${getActivityColor(activity.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <span className="text-sm">{getActivityIcon(activity.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Benefits Cost Trend</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-500">Chart visualization would go here</p>
                <p className="text-sm text-gray-400">Integration with charting library needed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Compliance Status</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <p className="text-gray-500">Pie chart visualization would go here</p>
                <p className="text-sm text-gray-400">Integration with charting library needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
