'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SalesDashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeAgents: 0,
    inventoryItems: 0,
    pendingRequests: 0,
    monthlyRevenue: 0,
    conversionRate: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [quickActions] = useState([
    {
      title: 'Client Roles',
      description: 'Manage client roles and permissions',
      icon: '👤',
      href: '/administratorpage/clientroles',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      category: 'Sales Operations'
    },
    {
      title: 'Inventory',
      description: 'Track and manage product inventory',
      icon: '📦',
      href: '/administratorpage/Inventory',
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      category: 'Sales Operations'
    },
    {
      title: 'Reinvestment Request',
      description: 'Process reinvestment requests',
      icon: '🔄',
      href: '/administratorpage/reinversmentrequest',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      category: 'Sales Operations'
    },
    {
      title: 'Agent Monitoring',
      description: 'Monitor sales agent performance',
      icon: '🎯',
      href: '/administratorpage/agentmonitoring',
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      category: 'Client Management'
    },
    {
      title: 'Telephones',
      description: 'Manage telephone systems and calls',
      icon: '📞',
      href: '/administratorpage/telephones',
      color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      category: 'Client Management'
    },
    {
      title: 'Timestamp',
      description: 'Track time and attendance',
      icon: '⏱️',
      href: '/administratorpage/timestamp',
      color: 'bg-gradient-to-r from-pink-500 to-pink-600',
      category: 'Time & Tracking'
    }
  ]);

  const [charts] = useState([
    {
      title: 'Sales Performance Trend',
      type: 'line',
      data: [12000, 15000, 18000, 16000, 20000, 22000],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    {
      title: 'Client Distribution',
      type: 'doughnut',
      data: [45, 30, 15, 10],
      labels: ['Active', 'Prospect', 'Inactive', 'Lost']
    }
  ]);

  useEffect(() => {
    // Simulate data loading
    setStats({
      totalClients: 248,
      activeAgents: 12,
      inventoryItems: 156,
      pendingRequests: 8,
      monthlyRevenue: 125000,
      conversionRate: 24.5
    });

    setRecentActivities([
      {
        id: 1,
        action: 'New client role assigned to premium tier',
        time: '30 minutes ago',
        type: 'clientroles',
        status: 'completed'
      },
      {
        id: 2,
        action: 'Inventory updated - 25 new products added',
        time: '1 hour ago',
        type: 'inventory',
        status: 'completed'
      },
      {
        id: 3,
        action: 'Agent performance review completed',
        time: '2 hours ago',
        type: 'agentmonitoring',
        status: 'completed'
      },
      {
        id: 4,
        action: 'Reinvestment request approved for Q3',
        time: '3 hours ago',
        type: 'reinvestment',
        status: 'completed'
      },
      {
        id: 5,
        action: 'Telephone system maintenance scheduled',
        time: '1 day ago',
        type: 'telephones',
        status: 'pending'
      },
      {
        id: 6,
        action: 'Time tracking report generated',
        time: '2 days ago',
        type: 'timestamp',
        status: 'completed'
      }
    ]);
  }, []);

  const getActivityIcon = (type) => {
    const icons = {
      clientroles: '👤',
      inventory: '📦',
      reinvestment: '🔄',
      agentmonitoring: '🎯',
      telephones: '📞',
      timestamp: '⏱️'
    };
    return icons[type] || '📋';
  };

  const getActivityColor = (type) => {
    const colors = {
      clientroles: 'text-blue-600 bg-blue-100',
      inventory: 'text-emerald-600 bg-emerald-100',
      reinvestment: 'text-purple-600 bg-purple-100',
      agentmonitoring: 'text-orange-600 bg-orange-100',
      telephones: 'text-indigo-600 bg-indigo-100',
      timestamp: 'text-pink-600 bg-pink-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Sales Operations': 'from-emerald-500 to-emerald-600',
      'Client Management': 'from-blue-500 to-blue-600',
      'Time & Tracking': 'from-purple-500 to-purple-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const groupedActions = quickActions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category].push(action);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Agents</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeAgents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Inventory Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inventoryItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions by Category */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Operations</h2>
              <div className="space-y-6">
                {Object.entries(groupedActions).map(([category, actions]) => (
                  <div key={category}>
                    <div className="flex items-center mb-4">
                      <div className={`w-3 h-3 bg-gradient-to-r ${getCategoryColor(category)} rounded-full mr-3`}></div>
                      <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {actions.map((action, index) => (
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
                              <h4 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                {action.title}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
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
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
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
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Performance Trend</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-500">Sales Performance Chart</p>
                <p className="text-sm text-gray-400">Integration with charting library needed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Client Distribution</h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <p className="text-gray-500">Client Distribution Chart</p>
                <p className="text-sm text-gray-400">Integration with charting library needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
